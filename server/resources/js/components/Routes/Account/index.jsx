import React, { lazy } from 'react'
import { PrivateRoute } from '@auth'

const Settings = lazy(() => import('@pages/Account/Settings'))

export default ({ match }) => (
  <>
    <PrivateRoute path={`${match.url}/settings`} component={Settings} />
  </>
)

export { default as SettingRoutes } from './Settings'
