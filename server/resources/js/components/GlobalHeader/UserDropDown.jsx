import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Avatar, Menu, Icon } from 'antd'
import { getGravatar } from '@helpers/utils'
import HeaderDropdown from '../HeaderDropdown'
import { FormattedMessage, defineMessages } from 'react-intl'

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

const menu = () => (
  <Menu css={css(menuStyles)} selectedKeys={[]}>
    <Menu.Item key="accountSettings">
      <Icon type="user" />
      <FormattedMessage
        id="menu.account.settings"
        defaultMessage="Account Settings"
      />
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout">
      <Icon type="logout" />
      <FormattedMessage id="menu.account.logout" defaultMessage="Logout" />
    </Menu.Item>
  </Menu>
)

export default ({ user }) => (
  <HeaderDropdown overlay={menu} placement="bottomRight">
    <DropDown>
      <Avatar size="small" src={getGravatar(user.email)} alt="avatar" />
      <Name>{user.name}</Name>
    </DropDown>
  </HeaderDropdown>
)
