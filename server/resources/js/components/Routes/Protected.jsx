import React from 'react'
import { Redirect } from 'react-router'
import { AuthConsumer } from '@auth'

export default ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <AuthConsumer>
        (({(can, hasRole)}) =>
        <>
          {can(rest.permission) || hasRole(rest.role) ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )}
        </>
      </AuthConsumer>
    )}
  />
)
