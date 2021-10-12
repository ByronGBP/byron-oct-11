import { OrderBookStyled, ButtonReconnect } from './OrderBook.styles'
import { useOrderBook } from '../../hooks'

import TableData from "../TableData"

export const OrderBook = () => {
  const { data, reconnect, toggleFeed, isWSOpen, isLoading, currentAsset } = useOrderBook()
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
      <ButtonReconnect className={isWSOpen ? 'disabled' : ''}><button disabled={isWSOpen} onClick={() => reconnect()}>Reconnect</button></ButtonReconnect>
    </OrderBookStyled> : <></>
}
