import React, { lazy } from 'react'
import { PrivateRoute } from '@auth'

const Settings = lazy(() => import('@pages/Settings'))

export default ({ match }) => (
  <>
    <PrivateRoute path={`${match.url}`} component={Settings} />
  </>
)

export { default as SettingRoutes } from './Root'
