import React from 'react'
import { Route, Switch } from 'react-router-dom'

export default ({
  match,
  general: General,
  applications: Applications,
  oauth: OAuth,
}) => (
  <Switch>
    <Route exact path={`${match.url}`} component={General} />
    <Route exact path={`${match.url}/applications`} component={Applications} />
    <Route path={`${match.url}/oauth`} component={OAuth} />
  </Switch>
)
