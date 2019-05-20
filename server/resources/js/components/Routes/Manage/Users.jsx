import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

export default ({
  match,
  listView: ListView,
  createOrUpdate: CreateOrUpdate,
}) => (
  <Switch>
    <Route exact path={`${match.url}`} component={ListView} />
    <Route exact path={`${match.url}/create`} component={CreateOrUpdate} />
    <Route path={`${match.url}/:resourceId`} component={CreateOrUpdate} />
  </Switch>
)
