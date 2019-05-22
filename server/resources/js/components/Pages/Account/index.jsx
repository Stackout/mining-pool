import React, { Component } from 'react'
import { SettingRoutes } from '@routes/Account'
import { Switch } from 'react-router-dom'
import { Basic, Binding, Security, Notifications, Addresses } from './Settings'

class Account extends Component {
  render() {
    return (
      <div>
        <SettingRoutes
          basic={Basic}
          binding={Binding}
          security={Security}
          notifications={Notifications}
          addresses={Addresses}
        />
      </div>
    )
  }
}

export default Account
