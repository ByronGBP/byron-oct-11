import { OrderBookStyled } from "./styles"
import { useOrderBookData } from './hooks'

import TableData from "./TableData"

const OrderBook = () => {
  const { data, reconnect, toggleFeed, isOpen } = useOrderBookData()
  const { bids, asks, maxValue } = data

  return asks.length || bids.length ?
    <OrderBookStyled>
      <div className='title'>
        <h2>Order book</h2>
        <span>Spread 17.0 (0.05%)</span>
      </div>
      <TableData maxValue={maxValue} data={bids}/>
      <p className='text-mobile'>Spread 17.0 (0.05%)</p>
      <TableData maxValue={maxValue} data={asks} reverse/>
      <button disabled={!isOpen} onClick={() => toggleFeed()}>Toggle Feed</button>
      <button disabled={isOpen} onClick={() => reconnect()}>Reconnect</button>
    </OrderBookStyled> : <></>
}

export default OrderBook