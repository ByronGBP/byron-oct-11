import { useCallback, useReducer, useState } from 'react'
import { useSession, ProducId } from '.'
import { TableData } from '../types'

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

const handleOpen = (session) => {
  session.send(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] }))
}

type OrderBookData = { 
  asks: TableData[], 
  bids: TableData[], 
  maxValue: Number 
}

type OrderBookHook = {
  data: OrderBookData,
  reconnect: Function,
  toggleFeed: Function,
  isOpen: boolean
}

interface IBaseData {
  [key: number]: number
}
type BaseData = [IBaseData, IBaseData]
type OrderBookState = {
  data: BaseData
  dataParsed: [TableData[], TableData[]]
  maxValue: Number
}

type Action =
 | { type: 'message', data: [TableData[], TableData[]] }
 | { type: 'snapshot', data: [TableData[], TableData[]] }
 | { type: 'reset' }
 | { type: 'failure' }

const initialState: OrderBookState = { data: [{}, {}], dataParsed: [[], []], maxValue: 0 };


// [price, size]
const parseBaseData = (data: BaseData): [TableData[], TableData[], number] => {
  const [bids, asks] = data

  let totalBids = 0
  const sortedBids = Object.keys(bids).sort((a,b) => Number(b) - Number(a)).slice(0, 25)
  const parsedBids = sortedBids.reduce((acc: TableData[], keyPrice): TableData[] => {
    const price = Number(keyPrice)
    const size = Number(bids[price])
    totalBids += size
    return  [...acc, { total: totalBids, size, price }]
  } ,[])

  let totalAsks = 0
  const sortedAsks = Object.keys(asks).sort((a,b) => Number(a) - Number(b)).slice(0, 25)
  const parsedAsks = sortedAsks.reduce((acc: TableData[], keyPrice): TableData[] => {
    const price = Number(keyPrice)
    const size = Number(asks[price])
    totalAsks += size
    return  [...acc, { total: totalAsks, size, price }]
  } ,[])

  return [parsedBids, parsedAsks, Math.max(totalAsks, totalBids)]
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
      const [newBids, newAsks, maxValue] = parseBaseData(baseData)

      return { data: baseData, dataParsed: [newBids, newAsks], maxValue }
    }
    case 'message':
      const baseData = getBaseData(action.data, state.data)

      const [newBids, newAsks, maxValue] = parseBaseData(baseData)
      return { data: baseData, dataParsed: [newBids, newAsks], maxValue }
    case 'reset':
      return initialState
    default:
      throw new Error();
  }
}

export const useOrderBookData = (): OrderBookHook  => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [, setToggle] = useState(0)

  const handleMessage = (s, e) => {
    const message = JSON.parse(e.data)

    if (message.feed?.includes('snapshot')) {
      dispatch({ type: 'snapshot', data: [message.bids, message.asks] })
    } else if (typeof message.product_id === 'string') {
      console.log(message)
      // dispatch({ type: 'message', data: [message.bids, message.asks] })
    }
  }

  const { connect, sendMessage, isOpen } = useSession('wss://www.cryptofacilities.com/ws/v1', { onOpen: handleOpen, onMessage: handleMessage })

  const toggleFeed = useCallback(() => {
    setToggle((prev) => {
      const [from, to]: [ProducId, ProducId] = (prev + 1) % 2 === 0 ? ['PI_ETHUSD', 'PI_XBTUSD'] : ['PI_XBTUSD','PI_ETHUSD' ]
      sendMessage({ event: 'unsubscribe', feed: 'book_ui_1', product_ids: [from] })
      dispatch({ type: 'reset' })

      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: [to] })

      return prev + 1
    })
  }, [sendMessage])

  return { data: { bids: state.dataParsed[0], asks: state.dataParsed[1], maxValue: state.maxValue }, reconnect: connect, toggleFeed, isOpen  }
}
