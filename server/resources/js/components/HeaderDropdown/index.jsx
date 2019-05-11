import React, { PureComponent } from 'react'
import { Dropdown } from 'antd'
import { css } from '@emotion/core'

const containerStyles = css`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: '1px';

  @media screen and (max-width: 420px) {
    width: 100% !important;
    border-radius: 0 !important;
  }
`

export default class HeaderDropdown extends PureComponent {
  render() {
    const { overlayClassName, ...props } = this.props
    return (
      <Dropdown
        css={css(containerStyles, overlayClassName ? overlayClassName : ``)}
        {...props}
      />
    )
  }
}
