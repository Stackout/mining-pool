import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withRouter, Redirect } from 'react-router'
import { compose } from 'recompose'
import withSuspense from '@helpers/withSuspense'
import Manage from './Manage'

// Base Routes
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Wallet = lazy(() => import('@pages/Wallet'))
const Exception = lazy(() => import('@/components/Exceptions'))

export const Root = () => (
  <Switch>
    {/* Base Routes */}
    <Route exact path="/" component={Dashboard} />
    <Route path="/wallet" component={Wallet} />

    {/* Manage Routes */}
    <Route path="/manage" component={Manage} />

    {/* Exception Page */}
    <Route component={Exception} />
  </Switch>
)

export default compose(
  withRouter,
  withSuspense
)(Root)
