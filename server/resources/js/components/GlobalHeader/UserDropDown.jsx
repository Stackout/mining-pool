import React, { Component } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Avatar, Menu, Icon } from 'antd'
import { getGravatar } from '@helpers/utils'
import HeaderDropdown from '../HeaderDropdown'
import { FormattedMessage } from 'react-intl'
import { compose } from 'recompose'
import { withAuth } from '@auth'
import { Link } from 'react-router-dom'

const Name = styled.span`
  margin-left: 8px;
`

const menuStyles = css`
  min-width: 160px;
`

const DropDown = styled.div`
  display: flex;
  height: 100%;
  vertical-align: center;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
`

class UserDropDown extends Component {
  handleMenuItemClick = event => {
    const { logout } = this.props

    switch (event.key) {
      case 'logout':
        logout && logout()
        break
    }
  }

  render() {
    const { user } = this.props

    const menu = () => (
      <Menu
        css={css(menuStyles)}
        selectedKeys={[]}
        onClick={this.handleMenuItemClick}
      >
        <Menu.Item key="accountSettings">
          <Link to="/account/settings">
            <Icon type="user" />
            <FormattedMessage
              id="menu.account.settings"
              defaultMessage="Account Settings"
            />
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="Logout" />
        </Menu.Item>
      </Menu>
    )

    return (
      <HeaderDropdown overlay={menu} placement="bottomRight">
        <DropDown>
          <Avatar size="small" src={getGravatar(user.email)} alt="avatar" />
          <Name>{user.name}</Name>
        </DropDown>
      </HeaderDropdown>
    )
  }
}
export default compose(withAuth)(UserDropDown)
