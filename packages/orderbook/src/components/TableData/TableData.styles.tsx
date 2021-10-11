import { theme } from '../../styles' 
import styled from 'styled-components'

export const TableDataWrapper = styled.div`
  position: relative;
`

export const _TableData = styled.table`
  border-collapse: collapse;
  border-spacing: 0px;

  thead {
    display: none;

    @media (min-width: 768px) { 
      display: table-header-group;
    }
  }

  thead tr th {
    border-bottom: 1px solid rgba(255,255,255, .1); 
    border-collapse: collapse; 
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
    padding: 5px 25px;

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