import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useMediaType } from '../lib'
import { TableData } from '../types'
import { theme } from '../styles' 

import { BarChar, TableDataChar } from './BarChar'


const TableDataWrapper = styled.div`
  position: relative;
`

const _TableData = styled.table`
  border-collapse: separate;
  border-spacing: 0px;

  thead {
    display: none;

    @media (min-width: 768px) { 
      display: table-header-group;
    }
  }

  thead tr th {
    border-bottom: 1px solid rgba(255,255,255, .1); 
    border-collapse: separate; 
  } 

  th, td {
    text-align: right;
    text-transform: uppercase;
  }

  td {
    color: ${theme.colors.white};

    &.price {
      color: ${theme.colors.green};
    }
  }

  
  td.data, th {
    font-size: 14px;
    font-weight: bold;
    padding: 5px 30px;

    @media (min-width: 768px) { 
      padding: 5px 35px;
    }
  }

  tbody {
    tr {
      position:relative;
      transform:scale(1, 1);
    }
  }

  &.reverse {
    thead {
      display: table-header-group;
    }

    th, td {

      @media (min-width: 768px) { 
        text-align: left;
      }
    }

    td.price {
      color: ${theme.colors.red};
    }
  }
`

const formattedNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2 })

const ORDER = ['total', 'size', 'price']
const ORDER_REVERSE = ['price', 'size', 'total']

const getRows = (data, reverse, isMobile, maxValue) => {
  const _order = reverse || isMobile ? [...ORDER_REVERSE] : [...ORDER]
  const Bars: JSX.Element[] = []

  const BodyRows = data.map((item, idx) => {
    Bars.push(<BarChar key={'bar' + idx} position={idx} reverse={reverse} width={item.total * 100 / maxValue} />)
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


// Error tr dosn't apply position relative on all browser
// https://github.com/w3c/csswg-drafts/issues/1899
// Patch: create a separate BarChar from the table
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
      <TableDataChar className={reverse ? 'reverse' : ''}>
        {Bars}
      </TableDataChar>
    </TableDataWrapper>
  )
})

export default TableData