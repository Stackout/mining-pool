import React, { Component } from 'react'
import { Layout } from 'antd'
import RightContent from './RightContent'

const { Header } = Layout

class GlobalHeader extends Component {
  render() {
    return (
      <Header
        style={{
          background: '#fff',
          padding: '0 10px 0',
          boxShadow: ' 0 1px 4px rgba(0,21,41,.08)',
        }}
      >
        <RightContent />
      </Header>
    )
  }
}

export default GlobalHeader
