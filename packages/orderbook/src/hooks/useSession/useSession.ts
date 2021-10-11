import { useRef, useCallback, useEffect } from 'react'
import { IOptions, SessionHook, Event, EventCallback } from './useSession.types'

const handlerCreatorBind = (session: WebSocket, event: Event, fn: EventCallback ) => {
  if (!session) return
  const cb = function (e) {
    // console.log('happned -> ' + event)
    fn && fn(session, e)
  }

  session[event] = cb
}

const handlerCreatorUnbind = (session: WebSocket, event: Event) => {
if (!session) return

  session[event] = null
}

const handleUserLeavePage = (fb: Function) => {
  const callback = function() {
    if (document.hidden) fb()
  }
  document.addEventListener('visibilitychange', callback)

  return () => document.removeEventListener('visibilitychange', callback)
}

export const useSession = ( url: string, { onOpen, onMessage, onError, onClose }: IOptions = {}): SessionHook => {
  if (!url) throw new Error('No url provided')

  const session = useRef<null | WebSocket>(null)

  const bindEvents = useCallback((session) => {
    handlerCreatorBind(session, 'onopen', onOpen)
    handlerCreatorBind(session, 'onmessage', onMessage)
    handlerCreatorBind(session, 'onerror', onError)
    handlerCreatorBind(session, 'onclose', onClose)
  }, [])

  const unbindEvents = useCallback((session) => {
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

  const sendMessage = useCallback((message, resetBinding = false) => {
    // to reset the throttle event on onmessage
    if (resetBinding) {
      bindEvents(session.current)
    }

    session.current && session.current.send(JSON.stringify(message))
  }, [])

  const close = useCallback(() => {
    if (session.current && session.current.readyState === 1) {
      session.current.close()
      session.current = null
    }
  }, [])

  const unbindAllEvents = useCallback(() => {
    if (session.current) {
      unbindEvents(session.current)
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

  return { connect, sendMessage, close, isOpen: session.current ? session.current?.OPEN === 1 : false, session: session.current, bindEvents, unbindAllEvents }
}
