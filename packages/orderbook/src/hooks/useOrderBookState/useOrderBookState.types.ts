// [price, size]
export type RawData = [number, number]

export type OrderBookData = { 
  asks: TableData[], 
  bids: TableData[], 
  maxValue: Number
  spreadValue: string
}

export type OrderBookHook = {
  data: OrderBookData,
  reconnect: Function,
  toggleFeed: Function,
  isWSOpen: boolean
  isLoading: boolean
  currentAsset: 'BTC' | 'ETH'
}

export interface IBaseData {
  [key: number]: number
}
export type BaseData = [IBaseData, IBaseData]
export type OrderBookState = {
  data: BaseData
  dataParsed: [TableData[], TableData[], string]
  maxValue: Number
  isLoading: boolean
}

export type Action =
 | { type: 'message', data: [RawData[], RawData[]] }
 | { type: 'snapshot', data: [RawData[], RawData[]] }
 | { type: 'sleep' }
 | { type: 'failure' }

 export type TableData = {
  total: number
  size: number
  price: number
}