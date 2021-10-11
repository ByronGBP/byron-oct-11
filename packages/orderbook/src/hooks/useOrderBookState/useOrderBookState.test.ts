import { renderHook, act } from '@testing-library/react-hooks'

import { useOrderBookState, initialState, formattedNumber, checkBaseWithData, getBaseData, parseData, getSpread, getParsedData } from './useOrderBookState'
import { MOCK_STATE_DATA, MOCK_RAW_DATA, MOCK_MESSAGE_DATA, MOCK_STATE_DATA_MANIPULATED, MOCK_BASE_DATA, MOCK_DATA_PARSED } from '../__mocks__'

describe('useOrderBookState', () => {
  test('should throw an error if no valid action is sent', () => {
    const { result } = renderHook(() => useOrderBookState())

    act(() => {
      // ts ignore for lint that says invalid param
      //@ts-ignore
      result.current.dispatch({ type: 'no-valid' })
    })

    expect(result.error).toBeDefined()
  })

  test('should render with the initial data', () => {
    const { result } = renderHook(() => useOrderBookState())

    expect(result.current.state).toMatchObject(initialState)
  })

  test('should render with the initial data', () => {
    const { result } = renderHook(() => useOrderBookState())

    expect(result.current.state).toMatchObject(initialState)
  })

  test('should manipulate initial data after snapshot action', () => {
    const { result } = renderHook(() => useOrderBookState())

    act(() => {
      result.current.dispatch({ type: 'snapshot', data: [MOCK_RAW_DATA, MOCK_RAW_DATA] })
    })

    expect(result.current.state).toMatchObject(MOCK_STATE_DATA)
  })

  test('should manipulate current data after message action', () => {
    const { result } = renderHook(() => useOrderBookState())

    act(() => {
      result.current.dispatch({ type: 'snapshot', data: [MOCK_RAW_DATA, MOCK_RAW_DATA] })
    })

    act(() => {
      result.current.dispatch({ type: 'message', data: MOCK_MESSAGE_DATA })
    })

    expect(result.current.state).toMatchObject(MOCK_STATE_DATA_MANIPULATED)
  })

  test('should isLoading be true when sleep', () => {
    const { result } = renderHook(() => useOrderBookState())

    act(() => {
      result.current.dispatch({ type: 'snapshot', data: [MOCK_RAW_DATA, MOCK_RAW_DATA] })
    })

    act(() => {
      result.current.dispatch({ type: 'sleep' })
    })

    expect(result.current.state.isLoading).toEqual(true)
  })

  test('should isLoading be false after snapshot', () => {
    const { result } = renderHook(() => useOrderBookState())

    act(() => {
      result.current.dispatch({ type: 'snapshot', data: [MOCK_RAW_DATA, MOCK_RAW_DATA] })
    })

    act(() => {
      result.current.dispatch({ type: 'sleep' })
    })

    act(() => {
      result.current.dispatch({ type: 'snapshot', data: [MOCK_RAW_DATA, MOCK_RAW_DATA] })
    })

    expect(result.current.state.isLoading).toEqual(false)
  })
})

describe('manipulation functions', () => {
  test('formattedNumber should return a number to en-US format', () => {
    const result = formattedNumber(20.5)
    expect(result).toEqual('20.50')
  })

  test('checkBaseWithData should return an object type IBaseData with "price" as key and "size" as value', () => {
    // [price, size]
    const result = checkBaseWithData({}, [[234, 321], [654, 7654]])
    expect(result).toEqual({ '234': 321, '654': 7654 })
  })

  test('checkBaseWithData should return an object with added "price" as key and "size" as value', () => {
    // [price, size]
    const result = checkBaseWithData({ '234': 321, '654': 7654 }, [[543, 974]])
    expect(result).toEqual({ '234': 321, '654': 7654, '543': 974 })
  })

  test('checkBaseWithData should return an object with removing "price" as key and "size" as value if size is 0', () => {
    // [price, size]
    const result = checkBaseWithData({ '234': 321, '654': 7654 }, [[543, 0]])
    expect(result).toEqual({ '234': 321, '654': 7654 })
  })

  test('getBaseData should return a "BaseData" value when provided [RawData[], RawData[]]', () => {
    const result = getBaseData([ [[543, 234]], [[735, 123]] ])
    expect(result).toEqual([{ '543': 234 }, { '735': 123 }])
  })

  test('parseData should return a [TableData[], number] from a IBaseData value provided with price descending order & should return the totalSize of the TableData', () => {
    const expectedResult = [
      [
      {
        total: 123,
        size: 123,
        price: 543,
      },{
        total: 357,
        size: 234,
        price: 541,
      }], 357]

    const result = parseData({ '543': 123, '541': 234 })
    expect(result).toEqual(expectedResult)
  })

  test('parseData should return a [TableData[], number] from a IBaseData value provided with price ascending order & should return the totalSize of the TableData', () => {
    const expectedResult = [[{
        total: 234,
        size: 234,
        price: 541,
      },
      {
        total: 357,
        size: 123,
        price: 543,
      }
    ], 357]

    const result = parseData({ '543': 123, '541': 234 }, 1)
    expect(result).toEqual(expectedResult)
  })

  test('getSpread should return a formatted spread string from two integers', () => {
    const expectedResult = 'Spread 80.00 (66.67)%'

    const result = getSpread(120, 40)
    expect(result).toEqual(expectedResult)
  })

  test('getParsedData should return a [TableData[], TableData[], number, string] given a BaseData', () => {
    const result = getParsedData(MOCK_BASE_DATA)
    expect(result).toEqual(MOCK_DATA_PARSED)
  })
})