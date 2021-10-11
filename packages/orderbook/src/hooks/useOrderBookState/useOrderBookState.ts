import { useReducer } from 'react'
import { TableData,  RawData, IBaseData, BaseData, OrderBookState, Action } from './useOrderBookState.types'

const InitialData: BaseData = [{}, {}]
export const initialState: OrderBookState = { data: InitialData, dataParsed: [[], [], ''], maxValue: 0, isLoading: true }

export const formattedNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2 })

export const getBaseData = (newData: [RawData[], RawData[]], baseData = InitialData): BaseData => {
  const [bids, asks] = newData
  const [bidsBase, asksBase] = baseData

  return [checkBaseWithData(bidsBase, bids), checkBaseWithData(asksBase, asks)]
}

export const checkBaseWithData = (base: IBaseData, data: RawData[]): IBaseData => {
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

export const getParsedData = (data: BaseData): [TableData[], TableData[], number, string] => {
  const isMobile = window.innerWidth < 756
  const [bids, asks] = data

  const [parsedBids, totalBids] = parseData(bids)
  const [parsedAsks, totalAsks] = parseData(asks, 1)
  const spread = getSpread(parsedBids[0].price, parsedAsks[0].price)


  return [parsedBids, isMobile ? parsedAsks.reverse() : parsedAsks, Math.max(totalAsks, totalBids), spread]
}


export const parseData = (data: IBaseData, sortDirection = 0): [TableData[], number] => {
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

export const getSpread = (firstNunmber: number, secondNumber: number) => {
  const maxNum = Math.max(firstNunmber, secondNumber)
  const minNum = Math.min(firstNunmber, secondNumber)
  const spreadNum = maxNum - minNum
  return `Spread ${formattedNumber(spreadNum)} (${(spreadNum *  100 / maxNum).toFixed(2)})%`
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
    case 'sleep':
      return { ...state, isLoading: true }
    default:
      throw new Error()
  }
}

export const useOrderBookState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}