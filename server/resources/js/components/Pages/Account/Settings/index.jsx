import React, { Component } from 'react'
import { SettingRoutes } from '@routes/Account'
import { Switch } from 'react-router-dom'
import Basic from './Basic'
import Binding from './Binding'
import Notifications from './Notifications'
import Security from './Security'
import Addresses from './Addresses'
import { Menu, Icon, Layout } from 'antd'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const { Content } = Layout

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: #fff;
  min-height: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
`

export const Title = styled.div`
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`

export const SubTitle = styled.div`
  margin-bottom: 6px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
`


const LeftContent = styled.div`
  width: 25%;
`

const RightContent = styled.div`
  width: 75%;
  padding: 8px 40px;
`

class Account extends Component {
  render() {
    const { match } = this.props
    return (
      <Content style={{ margin: '24px' }}>
        <ContentWrapper>
          <LeftContent>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={['profile']}
              style={{ height: '100%' }}
            >
              <Menu.Item key="profile">
                <Link to="/account/settings">Profile</Link>
              </Menu.Item>
              <Menu.Item key="addresses">
                <Link to="/account/settings/addresses">Addresses</Link>
              </Menu.Item>
              <Menu.Item key="security">
                <Link to="/account/settings/security">Security Settings</Link>
              </Menu.Item>
              <Menu.Item key="bindings">
                <Link to="/account/settings/bindings">Account Bindings</Link>
              </Menu.Item>
              <Menu.Item key="notifications">
                <Link to="/account/settings/notifications">
                  Notification Settings
                </Link>
              </Menu.Item>
            </Menu>
          </LeftContent>
          <RightContent>
            <SettingRoutes
              match={match}
              basic={Basic}
              binding={Binding}
              security={Security}
              notifications={Notifications}
              addresses={Addresses}
            />
          </RightContent>
        </ContentWrapper>
      </Content>
    )
  }
}

export default Account
