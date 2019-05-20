import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withRouter, Redirect } from 'react-router'
import { compose } from 'recompose'
import withSuspense from '@helpers/withSuspense'
import Manage from './Manage'
import Account from './Account'
import { PrivateRoute, ManageRoute } from '@auth'

// Base Routes
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Wallet = lazy(() => import('@pages/Wallet'))
const Exception = lazy(() => import('@/components/Exceptions'))

export const Root = () => (
  <Switch>
    {/* Base Routes */}
    <PrivateRoute exact path="/" component={Dashboard} />
    <PrivateRoute path="/wallet" component={Wallet} />

    {/* Account Routes */}
    <PrivateRoute path="/account" component={Account} />

    {/* Manage Routes */}
    <ManageRoute path="/manage" component={Manage} />

    {/* Exception Page */}
    <Route component={Exception} />
  </Switch>
)

export default compose(
  withRouter,
  withSuspense
)(Root)
