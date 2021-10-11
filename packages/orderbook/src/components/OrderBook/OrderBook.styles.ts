import styled from 'styled-components'
import { theme, getButtonStyles } from '../../styles'

export const OrderBookStyled = styled.div`
  width: fit-content;
  position: relative;
  display: grid;
  grid-template: 1fr auto 1fr auto auto/ 1fr;
  background-color: ${theme.colors.background};
  transition: opacity 300ms ease;

  .table, .toggle-feed, .title {
    transition: opacity 300ms ease;
  }

  &.loading {
    opacity: .4;
  }

  &.ws-close {
    table, .toggle-feed, .title {
      opacity: .4;
    }
  }

  @media (min-width: 768px) { 
    grid-template: 1fr auto auto / 1fr 1fr;
  }

  .title {
    grid-area: 1 / 1 / span 1 / span 1;
    padding: 12px;
    border-bottom: 1px solid rgba(255,255,255, .2);

    span {
      display: none;
    }

    @media (min-width: 768px) { 
      grid-area: 1 / 1 / span 1 / span 2;
      display: grid;
      grid-template: auto / 1fr 1fr 1fr;
      justify-content: center;
      align-items: center;

      span {
        display: block;
      }
    }

    h2, span {
      font-size: 15px;
      color: ${theme.colors.white};
    }

    h2 {
      text-align: left;
      grid-area: 1 / 1 / span 1 / span 1;
    }

    span {
      text-align: center;
      opacity: .4;
      grid-area: 1 / 2 / span 1 / span 1;
    }
  }

  .text-mobile {
    grid-area: 3 / 1 / span 1 / span 1;
    font-size: 15px;
    opacity: .4;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px) { 
      display: none;
    }
  }

  .table {
    font-size: 15px;
    grid-row: 4 / span 1;
    grid-column:  span 1;

    &.table-second {
      grid-row: 2 / span 1;
    }

    @media (min-width: 768px) { 
      grid-row: 2 / span 1;

      &.table-second {
        grid-row: 2 / span 1;
      }
    }
  }

  .toggle-feed {
    ${getButtonStyles()}
    grid-area: 5 / 1 / span 1 / span 1;
    justify-self: center;
    align-self: center;

    @media (min-width: 768px) { 
      grid-area: 3 / 1 / span 1 / span 2;
    }
  }
`

export const ButtonReconnect = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;

    &.disabled {
      user-select: none;
      pointer-events: none;
    }

    @media (min-width: 768px) { 
      position: absolute;
      width: unset;
      height: unset;
      bottom: 0;
      right: 0;
    }
    
    button {
      ${getButtonStyles()}
      &:disabled {
        user-select: none;
        pointer-events: none;
        opacity: 0;
      }
    }

`