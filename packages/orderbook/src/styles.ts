import { css } from "styled-components";

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
