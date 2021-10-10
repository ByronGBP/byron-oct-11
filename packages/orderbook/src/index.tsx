import { OrderBookStyled, ButtonReconnect } from './styles'
import { useOrderBookData } from './hooks'

import TableData from "./TableData"

const OrderBook = () => {
  const { data, reconnect, toggleFeed, isWSOpen, isLoading, currentAsset } = useOrderBookData()
  const { bids, asks, maxValue, spreadValue } = data

  return asks.length || bids.length ?
    <OrderBookStyled className={isLoading ? 'loading' : !isWSOpen ? 'ws-close' : ''}>
      <div className='title'>
        <h2>Order book - {currentAsset}</h2>
        <span>{spreadValue}</span>
      </div>
      <TableData maxValue={maxValue} data={bids}/>
      <p className='text-mobile'>{spreadValue + ' - ' + currentAsset}</p>
      <TableData className='table-second' maxValue={maxValue} data={asks} reverse/>
      <button className='toggle-feed' disabled={!isWSOpen || isLoading} onClick={() => toggleFeed()}>Toggle Feed</button>
      <ButtonReconnect disabled={isWSOpen} onClick={() => reconnect()}>Reconnect</ButtonReconnect>
    </OrderBookStyled> : <></>
}

export default OrderBook