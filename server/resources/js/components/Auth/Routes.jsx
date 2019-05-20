import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import { compose } from 'recompose'
import withSuspense from '@helpers/withSuspense'
import Background from '@layout/DynamicBackground'
import { AuthPanel } from '@layout/Auth'

const Login = lazy(() => import('./Login'))
const RedirectComponent = lazy(() => import('./RedirectComponent'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const PasswordReset = lazy(() => import('./PasswordReset'))
const Register = lazy(() => import('./Register'))

export const Routes = () => (
  <Background>
    <AuthPanel>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={PasswordReset} />
        <Route component={RedirectComponent} />
      </Switch>
    </AuthPanel>
  </Background>
)

export default compose(withSuspense)(Routes)
