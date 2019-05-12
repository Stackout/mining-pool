import React, { createContext, Component } from 'react'
import { Route } from 'react-router-dom'
import { Query, compose } from 'react-apollo'
import { login } from '@graphql/Auth.graphql'
import { withCookies } from 'react-cookie'

export const AdminRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {auth => (
      <Route
        {...rest}
        render={props =>
          auth.isAdmin ? (
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
  setToken: () => {},
  setUser: () => {},
  setIsAuthenticated: () => {},
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

  setAuthentication = payload => {
    const { isAuthenticated, token, roles, permissions } = payload
    this.props.cookies.set('isAuthenticated', isAuthenticated)
    this.props.cookies.set('token', token)
    this.props.cookies.set('roles', JSON.stringify(roles))
    this.props.cookies.set('permissions', JSON.stringify(permissions))
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

    if (cookies.get('roles')) {
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
export default compose(withCookies)(AuthProvider)
