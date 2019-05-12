import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import { withAuth } from '@auth'

const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`
const { Sider } = Layout
const SubMenu = Menu.SubMenu

export const BaseSider = ({ collapsed, onCollapse, can }) => (
  <Sider
    collapsible
    collapsed={collapsed}
    onCollapse={onCollapse}
    style={{
      boxShadow: '2px 0 6px rgba(0,21,41,.35)',
      zIndex: '2',
    }}
  >
    <Logo />
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <Menu.Item key="1">
        <Icon type="pie-chart" />
        <span>Deshboard</span>
        <Link to="/" />
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="wallet" />
        <span>Wallet</span>
        <Link to="/wallet" />
      </Menu.Item>
      {can('update users') && (
        <SubMenu
          key="users"
          title={
            <span>
              <Icon type="user" />
              <span>Users</span>
            </span>
          }
        >
          <Menu.Item key="allUsers">
            All Users
            <Link to="/manage/users" />
          </Menu.Item>
          <Menu.Item key="createUser">
            Create User
            <Link to="/manage/users/create" />
          </Menu.Item>
          <Menu.Item key="userRoles">
            Roles
            <Link to="/manage/roles" />
          </Menu.Item>
          <Menu.Item key="userPermissions">
            Permissions <Link to="/manage/permissions" />
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  </Sider>
)

export default compose(
  withRouter,
  withAuth
)(BaseSider)
