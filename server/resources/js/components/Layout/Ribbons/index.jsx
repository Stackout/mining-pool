import React from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'

export const CornerRibbon = styled.div`
  width: 200px;
  background: #e43;
  position: absolute;
  top: 25px;
  left: -50px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 1px;
  color: #f0f0f0;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  position: fixed;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const topLeft = css`
  top: 25px;
  left: -50px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`

const topRight = css`
  top: 25px;
  right: -50px;
  left: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`

const bottomLeft = css`
  top: auto;
  bottom: 25px;
  left: -50px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`

const bottomRight = css`
  top: auto;
  right: -50px;
  bottom: 25px;
  left: auto;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`

export default ({ children, position, color }) => (
  <CornerRibbon
    css={
      position === 'top-left'
        ? topLeft
        : position === 'top-right'
        ? topRight
        : position === 'bottom-left'
        ? bottomLeft
        : bottomRight
    }
    style={{ backgroundColor: color ? color : '#F0F0F0' }}
  >
    {children}
  </CornerRibbon>
)

export { default as DevRibbon } from './DevRibbon'
