import React, { Component } from 'react'
import { SettingRoutes } from '@routes/Account'
import { Switch } from 'react-router-dom'
import { Basic, Binding, Security, Notifications } from './Settings'

class Account extends Component {
  render() {
    return (
      <div>
        <SettingRoutes
          basic={Basic}
          binding={Binding}
          security={Security}
          notifications={Notifications}
        />
      </div>
    )
  }
}

export default Account
