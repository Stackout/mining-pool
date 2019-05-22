import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

export default ({
  match,
  basic: Basic,
  binding: Binding,
  security: Security,
  notifications: Notifications,
  addresses: Addresses,
}) => (
  <Switch>
    <Route exact path={`${match.url}`} component={Basic} />
    <Route exact path={`${match.url}/basic`} component={Basic} />
    <Route exact path={`${match.url}/security`} component={Security} />
    <Route exact path={`${match.url}/binding`} component={Binding} />
    <Route exact path={`${match.url}/addresses`} component={Addresses} />
    <Route
      exact
      path={`${match.url}/notifications`}
      component={Notifications}
    />
  </Switch>
)
