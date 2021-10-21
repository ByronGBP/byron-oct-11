import styled from 'styled-components'
import { motion } from 'framer-motion'
import { memo } from 'react'

interface IBar {
  customWidth: number
  position: number
}

const _Bar = styled(motion.div)<IBar>`
  position: absolute;
  display: block;
  right: unset;
  bottom: 0;
  left: 0;
  top: ${({ position }) => position * 25}px;
  width: 0;
  background-color: rgba(0, 255 ,0, .1);

  @media (min-width: 768px) {
    left: unset;
    right: 0;
    bottom: 0;
    top: ${({ position }) => position * 26}px;
  }

  &.reverse {
    right: unset;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 0,0, .1);
  }
`

const _TableDataChart = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  user-select: none;

  &.disabled {
    pointer-events: none;
    user-select: none;
  }

  .bar {
    height: 25px;
  }

  &.reverse {
    top: 28px;
  }

  @media (min-width: 768px) {
    top: 26px;

    .bar {
      height: 26px;
    }
  }
`

const transition = {
  duration: .3,
  type: 'tween',
  ease: [.25, .1, .25, 1]
}

interface IBarChart {
  reverse: boolean
  className?: string
  width: number
  position: number
}

export const BarChart = memo<IBarChart>(({ reverse, className = '', width, position }) => {
  return <_Bar initial={{ width: '0%' }} transition={transition} animate={{ width: width + '%' }} className={`bar ${className} ${reverse ? 'reverse' : ''}`} customWidth={Math.round(width)} position={position}></_Bar>
})

export const TableDataChart = ({ className, children }) => {
  return <_TableDataChart className={className}>
    {children}
  </_TableDataChart>
}