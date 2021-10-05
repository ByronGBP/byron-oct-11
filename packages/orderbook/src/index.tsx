import { OrderBookStyled } from "./styles"
import { useOrderBookData } from './hooks'

import TableData from "./TableData"

const OrderBook = () => {
  const [data] = useOrderBookData()

  return data.length ?
    <OrderBookStyled>
      <div className='title'>
        <h2>Order book</h2>
        <span>Spread 17.0 (0.05%)</span>
      </div>
      <TableData data={data}/>
      <p className='text-mobile'>Spread 17.0 (0.05%)</p>
      <TableData data={data} reverse/>
      <button>Toggle Feed</button>
    </OrderBookStyled> : <></>
}

export default OrderBook