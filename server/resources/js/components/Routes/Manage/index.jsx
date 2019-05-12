import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

const Users = lazy(() => import('@pages/Manage/Users'))

export default ({ match }) => (
  <>
    <Route path={`${match.url}/users`} component={Users} />
  </>
)

export { default as UserRoutes } from './Users'
