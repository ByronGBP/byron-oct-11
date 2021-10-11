export interface Contextable {
  event: 'subscribe' | 'unsubscribe'
  feed: 'book_ui_1'
  product_ids: [ProducId]
}

export type ProducId = 'PI_XBTUSD' | 'PI_ETHUSD'
type SessionConnectHandler = (session: WebSocket, e: Event) => any
type SessionMessageHnalder = (session: WebSocket, ev: MessageEvent<any>) => any
type SessionDisconnectHandler = (session: WebSocket, e: Event) => any
type SessionErrorHandler = (session: WebSocket, e: Event) => any
export type MessageHandler = <T extends Contextable>(args: T, resetBinding?: boolean) => void

export interface IOptions {
  onOpen?: SessionConnectHandler | null
  onMessage?: SessionMessageHnalder | null
  onError?: SessionErrorHandler | null
  onClose?: SessionDisconnectHandler | null
}

export type SessionHook = {
  connect: Function
  close: Function,
  bindEvents: Function
  unbindAllEvents: Function
  sendMessage : MessageHandler
  isOpen: boolean
  session: WebSocket | null
}

export type Event = 'onopen' | 'onmessage' | 'onerror' | 'onclose'
export type EventCallback = SessionMessageHnalder | SessionConnectHandler | undefined | null