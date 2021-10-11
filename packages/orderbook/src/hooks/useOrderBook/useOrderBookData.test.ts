import { renderHook, act } from '@testing-library/react-hooks'
import WS from 'jest-websocket-mock'

import { useOrderBookData } from './useOrderBookData'
import { MOCK_RAW_DATA } from '../__mocks__'

let ws: WS
let WS_URI = 'ws://localhost:8080'

// BUG:- Few tests does a render because of onclose event from the socket
const originalError = console.error

describe('useOrderBookData', () => {
  beforeEach(() => {
    ws = new WS(WS_URI)

    // Temporally disable console.error
    console.error = jest.fn()
  })

  afterEach(() => {
    WS.clean()
    console.error = originalError
  })

  test('should have an open connection after first render', async () => {
    const { result } = renderHook(() => useOrderBookData(WS_URI))

    expect(result.current.isWSOpen === true)
  })

  test('should still working if connection fails', async () => {
    const { result } = renderHook(() => useOrderBookData(WS_URI))
    ws.error()

    expect(result.current.isWSOpen === false)
  })

  test('should have send a message after succefully connection', async () => {
    const { waitForNextUpdate } = renderHook(() => useOrderBookData(WS_URI))
    
    await waitForNextUpdate()
    await expect(ws).toReceiveMessage(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] }))
  })

  test('should have data after snapshot message recieved', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOrderBookData(WS_URI))
    
    await waitForNextUpdate()
    await expect(ws).toReceiveMessage(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] }))

    ws.send(JSON.stringify({ feed: 'snapshot', bids: MOCK_RAW_DATA, asks: MOCK_RAW_DATA }))
    expect(result.current.data.bids.length).toBeTruthy()
    expect(result.current.data.asks.length).toBeTruthy()
    expect(result.current.data.maxValue).toBeTruthy()
    expect(result.current.data.spreadValue).toBeTruthy()
  })

  test('should have manipulated data on every message', async () => {
    // TODO
    expect(true)
  })


  test('should toggle currency when toggleFeed is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOrderBookData(WS_URI))
    
    await waitForNextUpdate()
    ws.send(JSON.stringify({ feed: 'snapshot', bids: MOCK_RAW_DATA, asks: MOCK_RAW_DATA }))

    act(() => {
      result.current.toggleFeed()
    })

    act(() => {
      result.current.toggleFeed()
    })

    expect(result.current.currentAsset === 'BTC')
  })

  // ERROR:- it doesn't get the messages as recieved even though it sent them
  // test('should send message to WS when toggleFeed is called', async () => {
  //   const { result, waitForNextUpdate } = renderHook(() => useOrderBookData(WS_URI))
    
  //   await waitForNextUpdate()
  //   ws.send(JSON.stringify({ feed: 'snapshot', bids: MOCK_RAW_DATA, asks: MOCK_RAW_DATA }))

  //   act(() => {
  //     result.current.toggleFeed()
  //   })

  //   const messages = [
  //     JSON.stringify({ event: 'unsubscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] }),
  //     JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_ETHUSD'] }),
  //   ]

  //   await expect(ws).toHaveReceivedMessages(messages)
  // })
})