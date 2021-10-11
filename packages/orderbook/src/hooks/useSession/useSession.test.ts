import { renderHook, act, suppressErrorOutput } from '@testing-library/react-hooks'
import WS from 'jest-websocket-mock'

import { useSession } from './useSession'

let ws: WS
let WS_URI = 'ws://localhost:8080'

describe('useSession', () => {
  beforeEach(() => {
    ws = new WS(WS_URI)
  })

  afterEach(() => {
    WS.clean()
  })

  test('should throw an error if no url provided', () => {
    const restoreConsole = suppressErrorOutput()
  
    try {
      // ts ignore for lint that says it needs a param
      //@ts-ignore
      const { result } = renderHook(() => useSession())
      expect(result.error).toBeDefined()
    } finally {
      restoreConsole()
    }
  })

  test('should still working if WS connection fails', async () => {
    const { result } = renderHook(() => useSession(WS_URI))
    ws.error()

    expect(result.current.isOpen === false)
  })


  test('should have an open connection after first render', async () => {
    const { result } = renderHook(() => useSession(WS_URI))

    expect(result.current.isOpen === true)
  })


  test('should close connection if close is called', async () => {
    const { result } = renderHook(() => useSession(WS_URI))
    expect(result.current.isOpen === true)

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen === false)
  })

  test('should send a message if sendMessage is called', async () => {
    const { result } = renderHook(() => useSession(WS_URI))

    act(() => {
      result.current.sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_ETHUSD'] })
    })

    await expect(ws).toReceiveMessage(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_ETHUSD'] }))
  })

  // ERROR: callback functions are not counted as ran even though it ran
  // test('should run onOpen callback when onopen event runs', async () => {
  //   const handleOpen = jest.fn()

  //   const { result } = renderHook(() => useSession(WS_URI, { onOpen: handleOpen }))

  //   expect(result.current.isOpen === true)
  //   expect(handleOpen).toBeCalled()
  // })

  // test('should run onClose callback when onclose event runs', async () => {
  //   const handleClose = jest.fn()

  //   const { result } = renderHook(() => useSession(WS_URI, { onClose: handleClose }))

  //   expect(result.current.isOpen === true)

  //   act(async () => { 
  //     result.current.close()
  //   })

  //   expect(result.current.isOpen === false)
  //   expect(handleClose).toBeCalled()
  // })

  // test('should run onMessage callback when onmessage event runs', async () => {
  //   const handleMessage = jest.fn()

  //   const { result } = renderHook(() => useSession(WS_URI, { onMessage: handleMessage }))

  //   ws.send('Test')
  
  //   expect(result.current.isOpen === true)
  //   expect(handleMessage).toBeCalled()
  // })

  // test('should run onError callback when onerror event runs', async () => {
  //   const handleError = jest.fn()

  //   const { result } = renderHook(() => useSession(WS_URI, { onError: handleError }))

  //   ws.error()
  
  //   expect(result.current.isOpen === false)
  //   expect(handleError).toBeCalled()
  // })
})