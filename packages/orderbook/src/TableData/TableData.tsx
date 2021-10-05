import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useMediaType } from '../lib'
import { TableData } from '../types'
import { theme } from '../styles' 

import BarChar from './BarChar'


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

  
  td, th {
    font-size: 14px;
    font-weight: bold;
    padding: 5px 30px;

    @media (min-width: 768px) { 
      padding: 5px 35px;
    }
  }

  tbody {
    tr {
      position: relative;
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

const getRows = (data, reverse, isMobile) => {
  const _order = reverse || isMobile ? [...ORDER_REVERSE] : [...ORDER]

  const BodyRows = data.map((item, idx) => {
    return (
      <tr key={'body'+idx}>
        {_order.map((key, idx) => {
          return <td key={reverse+key+idx} className={key + ' ' + reverse}>{formattedNumber(item[key] ?? 123)}</td>
        })}
        <BarChar reverse={reverse} width={item.total * 100 / 333306} />
      </tr>
    )
  })

  const HeadRows = <tr>{_order.map((item, idx) => <th key={idx}>{item}</th>)}</tr>

  return [HeadRows, BodyRows]
}

interface ITableData {
  data: TableData[]
  reverse?: boolean
}

const TableData = memo<ITableData>(({ data, reverse = false }) => {
  const mediaType = useMediaType()

  const [HeadRows, BodyRows] = useMemo(() => getRows(data, reverse, mediaType === 'mobile'), [data, reverse, mediaType === 'mobile'])

  return (
  <_TableData className={reverse ? 'reverse' : ''}>
    <thead>
      {HeadRows}
    </thead>
    <tbody>
      {BodyRows}
    </tbody>
  </_TableData>
  )
})

export default TableData