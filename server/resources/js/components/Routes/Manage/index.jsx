import React, { lazy } from 'react'
import { PrivateRoute } from '@auth'

const Users = lazy(() => import('@pages/Manage/Users'))

export default ({ match }) => (
  <>
    <PrivateRoute path={`${match.url}/users`} component={Users} />
  </>
)

export { default as UserRoutes } from './Users'
