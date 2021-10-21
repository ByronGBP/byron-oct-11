import { useCallback, useEffect, useState } from 'react'
import { useSession, ProducId } from '../useSession'
import throttle from 'lodash.throttle'
import { OrderBookHook } from '../useOrderBookState'
import { useOrderBookState } from '../useOrderBookState'

const getNewCurrency = (num): [ProducId, ProducId] => (num + 1) % 2 === 0 ? ['PI_ETHUSD', 'PI_XBTUSD'] : ['PI_XBTUSD','PI_ETHUSD']

// to patch bug: When it toggles coins, it sends 1 duplicate message
let isSaveToThrottled = false

// to patch bug: When it toggles coins the last throttled function still running once
let currentCurrency: ProducId | '' = ''
interface ISwapper {
  [key: string]: 'BTC' | 'ETH' 
}
const SWAPPER: ISwapper = {
  'PI_XBTUSD': 'BTC',
  'PI_ETHUSD': 'ETH'
}

export const useOrderBook = (url: string = 'wss://www.cryptofacilities.com/ws/v1'): OrderBookHook  => {
  const [currentAsset, setAsset] = useState<'BTC' | 'ETH'>('BTC')
  const [isOpen, setOpen] = useState(false)
  const { dispatch, state } = useOrderBookState()
  const [, setToggle] = useState(0)

  const handleOpen = (session) => {
    currentCurrency = currentCurrency ? currentCurrency : 'PI_XBTUSD'
    setAsset(SWAPPER[currentCurrency])
    setOpen(true)
    session.send(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: [currentCurrency] }))
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMessage = (s, e) => {
    const message = JSON.parse(e.data)

    if (message.feed?.includes('snapshot')) {
      isSaveToThrottled = true
      dispatch({ type: 'snapshot', data: [message.bids, message.asks] })
    } else if (isSaveToThrottled && typeof message.product_id === 'string') {
      const message = JSON.parse(e.data)

      if (typeof message.product_id === 'string' && message.product_id === currentCurrency) {
        dispatch({ type: 'message', data: [message.bids, message.asks] })
      }
    }
  }

  const { connect, sendMessage, unbindAllEvents } = useSession(url, { onOpen: handleOpen, onMessage: handleMessage, onClose: handleClose })

  const toggleFeed = useCallback(() => {
    setToggle((prev) => {
      const [from, to] = getNewCurrency(prev)

      sendMessage({ event: 'unsubscribe', feed: 'book_ui_1', product_ids: [from] }, true)
      
      currentCurrency = to
      isSaveToThrottled = false

      setAsset(SWAPPER[currentCurrency])
      dispatch({ type: 'sleep' })

      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: [to] })

      return prev + 1
    })
  }, [sendMessage])

  useEffect(() => {
    return () => unbindAllEvents()
  }, [])

  return { data: { bids: state.dataParsed[0], asks: state.dataParsed[1], maxValue: state.maxValue, spreadValue: state.dataParsed[2] }, reconnect: connect, toggleFeed, isWSOpen: isOpen, isLoading: state.isLoading, currentAsset }
}
