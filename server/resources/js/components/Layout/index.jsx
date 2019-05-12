import React from 'react'
import { Layout, PageHeader as AntDPageHeader } from 'antd'
import Sider from '../Menu/Sider'
import { compose } from 'recompose'
import { withLayoutConsumer } from './Context'
import GlobalHeader from '../GlobalHeader'
import styled from '@emotion/styled'

const { Content, Footer } = Layout

export const BaseLayout = ({ collapsed, onCollapse, children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={collapsed} onCollapse={onCollapse} />
      <Layout>
        <GlobalHeader />
        <Content>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          HelixAlpha Mining Pool &copy;2019; Created by HelixAlpha, Inc.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default compose(withLayoutConsumer)(BaseLayout)

const PageHeaderContainer = styled.div`
  width: 100%;
  background-color: #fff;
`

export const PageHeader = ({ title, breadcrumb, children }) => (
  <PageHeaderContainer>
    <AntDPageHeader title={title} breadcrumb={breadcrumb}>
      <div className="wrap">
        <div className="content">{children}</div>
      </div>
    </AntDPageHeader>
  </PageHeaderContainer>
)
