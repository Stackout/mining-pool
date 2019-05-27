import React, { createContext, Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { compose, withApollo } from 'react-apollo'
import { login, logout } from '@graphql/Auth.graphql'
import { withCookies } from 'react-cookie'
import ME from '@graphql/Me.graphql'
import { transformRolesAndPermissions } from '@helpers/utils';

export const AdminRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {({ hasRole }) => (
      <Route
        {...rest}
        render={props =>
          hasRole('admin') ? (
            <Component {...props} auth={auth} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )}
  </AuthContext.Consumer>
)

export const ManageRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {auth => (
      <Route
        {...rest}
        render={props =>
          auth.hasRole('admin') || auth.hasRole('moderator') ? (
            <Component {...props} auth={auth} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )}
  </AuthContext.Consumer>
)

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {auth => (
      <Route
        {...rest}
        render={props =>
          auth.hasRole('user') ||
          auth.hasRole('admin') ||
          auth.hasRole('moderator') ? (
            <Component {...props} auth={auth} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )}
  </AuthContext.Consumer>
)

export const AuthContext = createContext({
  isAuthenticated: false,
  logout: () => {},
  can: () => {},
  hasRole: () => {},
})

export class AuthProvider extends Component {

  setAuthentication = payload => {
    const { isAuthenticated, roles, permissions } = payload
    this.setState({
      isAuthenticated,
      roles,
      permissions,
    })
  }

  can = permission => {
    const { permissions } = this.state
    return permissions.includes(permission)
  }

  hasRole = role => {
    const { roles } = this.state
    return roles.includes(role)
  }

  logout = () => {
    const { client } = this.props

    client
      .mutate({
        mutation: logout,
      })
      .then(response => {
        this.setState({
          isAuthenticated: false,
          roles: [],
          permissions: [],
        })
      })
  }

  state = {
    logout: this.logout,
    setAuthentication: this.setAuthentication,
    can: this.can,
    hasRole: this.hasRole,
  }

  componentDidMount() {
    const { client } = this.props

    this.setState({
      isAuthenticated: false,
      isAuthenticating: true,
    })

    client
      .query({
        query: ME,
      })
      .then(response => {
        if (response.data.me) {
          const [ roles, permissions ] = transformRolesAndPermissions(response.data.me)  
          this.setState({
            isAuthenticated: true,
            isAuthenticating: false,
            roles: roles,
            permissions: permissions,
          })
        } else {
          this.setState({
            isAuthenticated: false,
            isAuthenticating: false,
          })
        }
      }).catch(error => {
        this.setState({
          isAuthenticating: false,
        })
      })
  }

  render() {
    const { children } = this.props
    return (
      <AuthContext.Provider value={this.state}>{children}</AuthContext.Provider>
    )
  }
}

export function withAuth(Component) {
  return function WrapperComponent(rest) {
    return (
      <AuthConsumer>{props => <Component {...props} {...rest} />}</AuthConsumer>
    )
  }
}

export { default as AuthRoutes } from './Routes'
export const AuthConsumer = AuthContext.Consumer
export default compose(
  withCookies,
  withApollo
)(AuthProvider)
