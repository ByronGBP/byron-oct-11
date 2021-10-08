import { useRef, useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

interface Contextable {
  event: 'subscribe' | 'unsubscribe'
  feed: 'book_ui_1'
  product_ids: [ProducId]
}

export type ProducId = 'PI_XBTUSD' | 'PI_ETHUSD'
type SessionConnectHandler = (session: WebSocket, e: Event) => any
type SessionMessageHnalder = (session: WebSocket, ev: MessageEvent<any>) => any
type SessionDisconnectHandler = (session: WebSocket, e: Event) => any
type SessionErrorHandler = (session: WebSocket, e: Event) => any
export type MessageHandler = <T extends Contextable>(args: T) => void

interface IOptions {
  onOpen?: SessionConnectHandler | null
  onMessage?: SessionMessageHnalder | null
  onError?: SessionErrorHandler | null
  onClose?: SessionDisconnectHandler | null
}

type SessionHook = {
  connect: Function
  close: Function
  sendMessage : MessageHandler
  isOpen: boolean
}

const handlerCreatorBind = (session, event, fn, forceRender) => {
  if (!session) return
  const cb = (e) => {
    console.log('happend -> ', event)
    fn && fn(session, e)
    event !== 'onmessage' && forceRender((old) => (old + 1) % 2)
  }

  session[event] = cb
}

// event === 'onmessage' ? throttle(cb, 5000) :

const handlerCreatorUnbind = (session, event) => {
  if (!session) return

  session[event] = null
}

const handleUserLeavePage = (fb) => {
  const callback = function() {
    if (document.hidden) fb()
  }
  document.addEventListener('visibilitychange', callback)

  return () => document.removeEventListener('visibilitychange', callback)
}

export const useSession = ( url: string, { onOpen, onMessage, onError, onClose }: IOptions): SessionHook => {
  const session = useRef<null | WebSocket>(null)
  const [, forceRender] = useState(0)

  const bindEvents = useCallback((session) => {
    console.log('binding')
    handlerCreatorBind(session, 'onopen', onOpen, forceRender)
    handlerCreatorBind(session, 'onmessage', onMessage, forceRender)
    handlerCreatorBind(session, 'onerror', onError, forceRender)
    handlerCreatorBind(session, 'onclose', onClose, forceRender)
  }, [])

  const unbindEvents = useCallback((session) => {
    console.log('unbinding')
    handlerCreatorUnbind(session, 'onopen')
    handlerCreatorUnbind(session, 'onmessage')
    handlerCreatorUnbind(session, 'onerror')
    handlerCreatorUnbind(session, 'onclose')
  }, [])

  const connect = useCallback(() => {
    if (session.current) {
      console.warn('Attempt to connect with an open connection')
      return
    }

    session.current = new WebSocket(url)
    bindEvents(session.current)
  }, [])

  const sendMessage = useCallback((message) => {
    console.log('sending message -> ', message, session)
    session.current && session.current.send(JSON.stringify(message))
  }, [])

  const close = useCallback(() => {
    if (session.current && session.current.readyState === 1) {
      session.current.close()
      session.current = null
    }
  }, [])

  useEffect(() => {
    connect()
    const removeVisibilityListener = handleUserLeavePage(close)

    return () => {
      removeVisibilityListener()
      close()
    }
  }, [])

  return { connect, sendMessage, close, isOpen: session.current ? session.current?.OPEN === 1 : false }
}
