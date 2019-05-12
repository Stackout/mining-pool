import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

export default ({
  match,
  listView: ListView,
  createOrUpdate: CreateOrUpdate,
}) => (
  <>
    <Route exact path={`${match.url}`} component={ListView} />
    <Route exact path={`${match.url}/:userId`} component={CreateOrUpdate} />
    <Route exact path={`${match.url}/create`} component={CreateOrUpdate} />
  </>
)
