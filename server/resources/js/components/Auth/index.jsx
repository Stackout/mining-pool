import React, { createContext, Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { compose, withApollo } from 'react-apollo'
import { login, logout } from '@graphql/Auth.graphql'
import { withCookies } from 'react-cookie'

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
  token: null,
  user: null,
  isAuthenticated: false,
  logout: () => {},
  setToken: () => {},
  setUser: () => {},
  setIsAuthenticated: () => {},
  can: () => {},
  hasRole: () => {},
})

export class AuthProvider extends Component {
  setToken = token => {
    this.setState({
      token,
    })
  }

  setUser = user => {
    this.setState({
      user,
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

  setIsAuthenticated = isAuthenticated => {
    this.props.cookies.set('isAuthenticated', isAuthenticated)
    this.setState({
      isAuthenticated,
    })
  }

  logout = () => {
    const { cookies, client } = this.props

    client
      .mutate({
        mutation: logout,
      })
      .then(response => {
        cookies.remove('isAuthenticated')
        cookies.remove('token')
        cookies.remove('roles')
        cookies.remove('permissions')

        this.setState({
          isAuthenticated: false,
          token: null,
          roles: [],
          permissions: [],
        })
      })
  }

  setAuthentication = payload => {
    const { cookies } = this.props
    const { isAuthenticated, token, roles, permissions } = payload
    cookies.set('isAuthenticated', isAuthenticated)
    cookies.set('token', token)
    cookies.set('roles', JSON.stringify(roles))
    cookies.set('permissions', JSON.stringify(permissions))
    this.setState({
      isAuthenticated,
      token,
      roles,
      permissions,
    })
  }

  state = {
    token: null,
    isAuthenticated: false,
    user: null,
    logout: this.logout,
    setToken: this.setToken,
    setUser: this.setUser,
    setIsAuthenticated: this.setIsAuthenticated,
    setAuthentication: this.setAuthentication,
    can: this.can,
    hasRole: this.hasRole,
  }

  componentDidMount() {
    const { cookies } = this.props
    if (cookies.get('isAuthenticated')) {
      this.setAuthentication({
        isAuthenticated: true,
        token: cookies.get('token'),
        roles: cookies.get('roles'),
        permissions: cookies.get('permissions'),
      })
    }
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
