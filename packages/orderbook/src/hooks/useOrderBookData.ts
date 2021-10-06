import { useCallback, useEffect, useState } from 'react'
import { useSession, ProducId } from '.'
import { TableData } from '../types'

const MOCK_DATA: TableData[] = [
  {
    total: 1200.00,
    size: 1200.00,
    price: 34062.50,
  },
  {
    total: 12251.00,
    size: 13451.00,
    price: 34062.00,
  },
  {
    total: 15329.00,
    size: 2500.00,
    price: 34056.00,
  },
  {
    total: 17829.00,
    size: 1878.00,
    price: 34055.00,
  },
  {
    total: 25039.00,
    size: 7210.00,
    price: 34054.50,
  },
  {
    total: 26916.00,
    size: 1877.00,
    price: 34054.00,
  },
  {
    total: 29032.00,
    size: 2115.00,
    price: 34053.50,
  },
  {
    total: 31131.00,
    size: 2100.00,
    price: 34053.00,
  },
  {
    total: 31131.00,
    size: 2100.00,
    price: 34053.00,
  },
  {
    total: 32063.00,
    size: 932.00,
    price: 34052.50,
  },
  {
    total: 37412.00,
    size: 5349.00,
    price: 34051.50,
  },
  {
    total: 114438.00,
    size: 77026.00,
    price: 34050.00,
  },
  {
    total: 287836.00,
    size: 173388.00,
    price: 34049.50,
  },
  {
    total: 319888.00,
    size: 32062,
    price: 34049.00,
  },
  {
    total: 326297.00,
    size: 6409,
    price: 34048.50,
  },
  {
    total: 331298.00,
    size: 5001,
    price: 34048.00,
  },
  {
    total: 333306.00,
    size: 2008,
    price: 34047.50,
  },
]

const handleOpen = (session, e) => {
  console.log(session, e)

  session.send(JSON.stringify({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] }))
}

type OrderBookHook = {
  data: TableData[],
  reconnect: Function,
  toggleFeed: Function,
  isOpen: boolean | undefined
}

export const useOrderBookData = (): OrderBookHook  => {
  const [data, setData] = useState<TableData[]>([])
  const { connect, sendMessage, isOpen } = useSession('wss://www.cryptofacilities.com/ws/v1', { onOpen: handleOpen })
  const [, setToggle] = useState(0)

  const toggleFeed = useCallback(() => {
    setToggle((prev) => {
      const [from, to]: [ProducId, ProducId] = (prev + 1) % 2 === 0 ? ['PI_ETHUSD', 'PI_XBTUSD'] : ['PI_XBTUSD','PI_ETHUSD' ]
      sendMessage({ event: 'unsubscribe', feed: 'book_ui_1', product_ids: [from] })
      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: [to] })

      return prev + 1
    })
  }, [sendMessage])

  useEffect(() => {
    setData(MOCK_DATA)
  }, [])

  return { data, reconnect: connect, toggleFeed, isOpen }
}
