import styled, { css } from "styled-components";

export const theme = {
  colors: {
    background: '#101828',
    white: '#FFF',
    purple: '#5E39E1',
    red: '#B2212E',
    green: '#00885C',
  }
}

export const getButtonStyles = () => css`
  margin: 20px 0; 
  padding: 10px 13px;
  background-color: ${theme.colors.purple};
  color: ${theme.colors.white};
  border-radius: 5px;
  font-weight: bold;

  &:disabled {
    opacity: .4;
    pointer-events: none;
    user-select: none;
  }
`

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

export const ButtonReconnect = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    ${getButtonStyles()}
    z-index: 2;

    &:disabled {
      opacity: 0;
    }
`