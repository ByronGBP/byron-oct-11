import { memo, useMemo } from 'react'

import { useMediaType } from '../../lib'
import { TableData, formattedNumber } from '../../hooks/useOrderBookState'

import { BarChart, TableDataChart } from './BarChart'
import { TableDataWrapper, _TableData } from './TableData.styles'

const ORDER = ['total', 'size', 'price']
const ORDER_REVERSE = ['price', 'size', 'total']

const getRows = (data, reverse, isMobile, maxValue) => {
  const _order = reverse || isMobile ? [...ORDER_REVERSE] : [...ORDER]
  const Bars: JSX.Element[] = []

  const BodyRows = data.map((item, idx) => {
    Bars.push(<BarChart key={'bar' + idx} position={idx} reverse={reverse} width={item.total * 100 / maxValue} />)
    return (
      <tr key={'body'+idx}>
        {_order.map((key, idx) => {
          return <td key={reverse+key+idx} className={key + ' ' + reverse + ' data'}>{formattedNumber(item[key] ?? 123)}</td>
        })}
      </tr>
    )
  })

  const HeadRows = <tr>{_order.map((item, idx) => <th key={idx}>{item}</th>)}</tr>

  return [HeadRows, BodyRows, Bars]
}

interface ITableData {
  data: TableData[]
  reverse?: boolean
  maxValue: Number
  className?: string
}

// Error tr doesn't apply position relative on all browser
// https://github.com/w3c/csswg-drafts/issues/1899
// Patch: create a separate BarChart from the table
const TableData = memo<ITableData>(({ className = '', data, reverse = false, maxValue }) => {
  const mediaType = useMediaType()

  const [HeadRows, BodyRows, Bars] = useMemo(() => getRows(data, reverse, mediaType === 'mobile', maxValue), [data, reverse, mediaType === 'mobile', maxValue])

  return (
    <TableDataWrapper className={'table ' + className}>
      <_TableData className={reverse ? 'reverse' : ''}>
        <thead>
          {HeadRows}
        </thead>
        <tbody>
          {BodyRows}
        </tbody>
      </_TableData>
      <TableDataChart className={reverse ? 'reverse' : ''}>
        {Bars}
      </TableDataChart>
    </TableDataWrapper>
  )
})

export default TableData