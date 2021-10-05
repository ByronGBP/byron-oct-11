import Head from 'next/head'
import OrderBook from '@base/orderbook'
import styled from 'styled-components'

const Main = styled.main`
  height: 100vh;
  display: grid;
  justify-content: center;
  align-items: center;
`

export default function Home() {
  return (
    <>
      <Head>
        <title>Orderbook UI</title>
        <meta name="description" content="The order book gives a trader an opportunity to make more informed decisions based on the buy and sell interest of a particular cryptocurrency" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <OrderBook/>
      </Main>
      <footer>
      </footer>
    </>
  )
}
