import styled from 'styled-components'

interface IBar {
  customWidth: number
}

const _Bar = styled.div<IBar>`
  position: absolute;
  right: unset;
  bottom: 0;
  left: 0;
  top: 0;
  width: ${({ customWidth }) => customWidth}%;
  background-color: rgba(0, 255 ,0, .1);

  @media (min-width: 768px) {
    left: unset;
    right: 0;
    bottom: 0;
    top: 0;
  }

  &.reverse {
    right: unset;
    bottom: 0;
    left: 0;
    top: 0;
    background-color: rgba(255, 0,0, .1);
  }
`

const BarChar = ({ reverse, className = '', width }) => {
  return <_Bar className={`${className} ${reverse ? 'reverse' : ''}`} customWidth={width}></_Bar>
}

export default BarChar