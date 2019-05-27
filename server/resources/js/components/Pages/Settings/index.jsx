import React, { Component } from 'react'
import { SettingRoutes } from '@routes/Settings'
import General from './General'
import Applications from './Applications'
import OAuth from './OAuth'

class Settings extends Component {
  render() {
    const { match } = this.props
    return (
      <>
        <SettingRoutes
          match={match}
          general={General}
          applications={Applications}
          oauth={OAuth}
        />
      </>
    )
  }
}

export default Settings
