import React, { Component, Suspense, lazy } from 'react'
import { Layout } from 'antd'
import Sider from '../Menu/Sider'
import Routes from '@/components/Routes'
import Spinner from '@/components/Spinner'
import { Route } from 'react-router-dom'
import { compose } from 'recompose'
import { withLayoutConsumer } from './Context'
const Login = lazy(() => import('@auth/Login'))
import { withRouter } from 'react-router-dom'
import GlobalHeader from '../GlobalHeader'

const { Header, Content, Footer } = Layout

export const BaseLayout = ({ collapsed, onCollapse, children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={collapsed} onCollapse={onCollapse} />
      <Layout>
        <GlobalHeader />
        <Content style={{ margin: '0 16px' }}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          DarkMatter Mining Pool &copy;2019; Created by HelixAlpha, Inc.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default compose(withLayoutConsumer)(BaseLayout)
