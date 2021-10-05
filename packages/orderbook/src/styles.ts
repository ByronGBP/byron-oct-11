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
`

export const OrderBookStyled = styled.div`
  width: fit-content;
  display: grid;
  grid-template: 1fr auto 1fr auto auto/ 1fr;
  background-color: ${theme.colors.background};

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

  table {
    font-size: 15px;
    grid-row: 4 / span 1;
    grid-column:  span 1;

    &:nth-of-type(2) {
      grid-row: 2 / span 1;
    }

    @media (min-width: 768px) { 
      grid-row: 2 / span 1;

      &:nth-of-type(2) {
        grid-row: 2 / span 1;
      }
    }
  }

  button {
    ${getButtonStyles()}
    grid-area: 5 / 1 / span 1 / span 1;
    justify-self: center;
    align-self: center;

    @media (min-width: 768px) { 
      grid-area: 3 / 1 / span 1 / span 2;
    }
  }
`