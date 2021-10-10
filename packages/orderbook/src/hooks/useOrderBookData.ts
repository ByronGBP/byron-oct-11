import { useCallback, useReducer, useState } from 'react'
import { useSession, ProducId } from '.'
import { TableData } from '../types'
import throttle from 'lodash.throttle'

const MOCK_DATA: TableData[] = [
  {
    total: 1200.00,
    size: 1200.00,
    price: 34062.50,
  },
  {
    total: 12251.00,
    size: 13451.00,
    price: 34062.00,
  },
  {
    total: 15329.00,
    size: 2500.00,
    price: 34056.00,
  },
  {
    total: 17829.00,
    size: 1878.00,
    price: 34055.00,
  },
  {
    total: 25039.00,
    size: 7210.00,
    price: 34054.50,
  },
  {
    total: 26916.00,
    size: 1877.00,
    price: 34054.00,
  },
  {
    total: 29032.00,
    size: 2115.00,
    price: 34053.50,
  },
  {
    total: 31131.00,
    size: 2100.00,
    price: 34053.00,
  },
  {
    total: 31131.00,
    size: 2100.00,
    price: 34053.00,
  },
  {
    total: 32063.00,
    size: 932.00,
    price: 34052.50,
  },
  {
    total: 37412.00,
    size: 5349.00,
    price: 34051.50,
  },
  {
    total: 114438.00,
    size: 77026.00,
    price: 34050.00,
  },
  {
    total: 287836.00,
    size: 173388.00,
    price: 34049.50,
  },
  {
    total: 319888.00,
    size: 32062,
    price: 34049.00,
  },
  {
    total: 326297.00,
    size: 6409,
    price: 34048.50,
  },
  {
    total: 331298.00,
    size: 5001,
    price: 34048.00,
  },
  {
    total: 333306.00,
    size: 2008,
    price: 34047.50,
  },
]

type OrderBookData = { 
  asks: TableData[], 
  bids: TableData[], 
  maxValue: Number
  spreadValue: string
}

type OrderBookHook = {
  data: OrderBookData,
  reconnect: Function,
  toggleFeed: Function,
  isWSOpen: boolean
  isLoading: boolean
}

interface IBaseData {
  [key: number]: number
}
type BaseData = [IBaseData, IBaseData]
type OrderBookState = {
  data: BaseData
  dataParsed: [TableData[], TableData[], string]
  maxValue: Number
  isLoading: boolean
}

type Action =
 | { type: 'message', data: [TableData[], TableData[]] }
 | { type: 'snapshot', data: [TableData[], TableData[]] }
 | { type: 'reset' }
 | { type: 'failure' }

const initialState: OrderBookState = { data: [{}, {}], dataParsed: [[], [], ''], maxValue: 0, isLoading: true };

const formattedNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2 })

const parseData = (data, sortDirection = 0): [TableData[], number] => {
  let totalSize = 0
  const sortedData = Object.keys(data).sort((a,b) => sortDirection ? Number(a) - Number(b) : Number(b) - Number(a) ).slice(0, 25)
  const parsedData = sortedData.reduce((acc: TableData[], keyPrice): TableData[] => {
    const price = Number(keyPrice)
    const size = Number(data[price])
    totalSize += size
    return  [...acc, { total: totalSize, size, price }]
  } ,[])

  return [parsedData, totalSize]
}

// [price, size]
const getParsedData = (data: BaseData): [TableData[], TableData[], number, string] => {
  const isMobile = window.innerWidth < 756
  const [bids, asks] = data

  const [parsedBids, totalBids] = parseData(bids)
  const [parsedAsks, totalAsks] = parseData(asks, 1)
  
  const maxNum = Math.max(parsedBids[0].price, parsedAsks[0].price)
  const minNum = Math.min(parsedBids[0].price, parsedAsks[0].price)
  const spreadNum = maxNum - minNum
  const spread =`Spread  ${formattedNumber(spreadNum)} (${(spreadNum *  100 / maxNum).toFixed(2)})%`

  return [parsedBids, isMobile ? parsedAsks.reverse() : parsedAsks, Math.max(totalAsks, totalBids), spread]
}

const InitialData = [{}, {}]

const checkBaseWithData = (base, data) => {
  const newBase = { ...base }
  for (let idx = 0; idx < data.length; idx++) {
    const item = data[idx]

    if (item[1] === 0 && newBase[item[0]]) {
      delete newBase[item[0]]
    } else if (item[1] !== 0) {
      newBase[item[0]] = item[1]
    }
  }

  return newBase
}

const getBaseData = (newData, baseData = InitialData): BaseData => {
  const [bids, asks] = newData
  const [bidsBase, asksBase] = baseData

  return [checkBaseWithData(bidsBase, bids), checkBaseWithData(asksBase, asks)]
}

function reducer(state: OrderBookState, action: Action): OrderBookState {
  switch (action.type) {
    case 'snapshot': {
      const baseData = getBaseData(action.data)
      const [newBids, newAsks, maxValue, spreadValue] = getParsedData(baseData)

      return { data: baseData, dataParsed: [newBids, newAsks, spreadValue], maxValue, isLoading: false }
    }
    case 'message':
      const baseData = getBaseData(action.data, state.data)

      const [newBids, newAsks, maxValue, spreadValue] = getParsedData(baseData)
      return { ...state, data: baseData, dataParsed: [newBids, newAsks, spreadValue], maxValue }
    case 'reset':
      return { ...state, isLoading: true }
    default:
      throw new Error();
  }
}

// to patch bug: When it toggles coins, it sends 1 duplicate message
let isSaveToThrottled = false

// to patch bug: When it toggles coins the last throttled function still running once
let currentCurrency = ''

export const useOrderBookData = (): OrderBookHook  => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [, setToggle] = useState(0)

  const handleOpen = (session) => {
    currentCurrency = currentCurrency ? currentCurrency : 'PI_XBTUSD'
    session.send(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: [currentCurrency] }))
  }

  const handleMessage = (s, e) => {
    const message = JSON.parse(e.data)

    if (message.feed?.includes('snapshot')) {
      isSaveToThrottled = true
      dispatch({ type: 'snapshot', data: [message.bids, message.asks] })
    } else if (isSaveToThrottled && typeof message.product_id === 'string') {
      const cb = throttle((e) => {
        console.log('happend throttle')
        const message = JSON.parse(e.data)
        if (typeof message.product_id === 'string' && message.product_id === currentCurrency) {
          dispatch({ type: 'message', data: [message.bids, message.asks] })
        }
      }, 5000)

      s.onmessage = cb
    }
  }

  const { connect, sendMessage, isOpen } = useSession('wss://www.cryptofacilities.com/ws/v1', { onOpen: handleOpen, onMessage: handleMessage })

  const toggleFeed = useCallback(() => {
    setToggle((prev) => {
      const [from, to]: [ProducId, ProducId] = (prev + 1) % 2 === 0 ? ['PI_ETHUSD', 'PI_XBTUSD'] : ['PI_XBTUSD','PI_ETHUSD' ]
      sendMessage({ event: 'unsubscribe', feed: 'book_ui_1', product_ids: [from] }, true)
      
      currentCurrency = to
      isSaveToThrottled = false
      dispatch({ type: 'reset' })

      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: [to] })

      return prev + 1
    })
  }, [sendMessage])

  return { data: { bids: state.dataParsed[0], asks: state.dataParsed[1], maxValue: state.maxValue, spreadValue: state.dataParsed[2] }, reconnect: connect, toggleFeed, isWSOpen: isOpen, isLoading: state.isLoading  }
}
