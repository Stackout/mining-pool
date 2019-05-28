import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { withFormProvider } from '@context/Form'
import { compose } from 'recompose'
import { Form, Input, Typography, Button } from 'antd'

const { Title } = Typography

const ReauthenticateUserContext = React.createContext()

export function withReauthenticateUser(Component) {
  function WrapperComponent(props) {
    return (
      <ReauthenticateUserProvider {...props}>
        {(rest) => <Component {...props} {...rest}/>}
      </ReauthenticateUserProvider>
    )
  }

  return compose(
    withFormProvider,
    withApollo
  )(WrapperComponent)
}

class ReauthenticateUserProvider extends Component {

  handleAuthentication = (event) => {
    const { client, form, onUserAuthenticated } = this.props

    form.validateFields((errors, values) => {

      this.setState({
        isAuthenticated: true,
        password: values.password
      })

    })
  }

  state = {
    isAuthenticating: false,
    isAuthenticated: false,
    password: null,
    handleAuthentication: this.handleAuthentication,
    form: this.props.form
  }

  render() {
    const { children } = this.props
    return (
      <ReauthenticateUserContext.Provider value={this.state}>
        {children(this.state)}
      </ReauthenticateUserContext.Provider>
    )
  }
}

export const ReauthenticateUser = ({children}) => {
  return (
    <ReauthenticateUserContext.Consumer>
        {(props) => (<Form>
          {!props.isAuthenticated ? 
          <>
            <Title level={4}>Enter your password to continue</Title>
              The setting you are trying to change requires that you re-enter your password.
              <Form.Item>
                {props.form.getFieldDecorator('password', {
                  rules: [
                    {required: true, message: 'Password is required.'}
                  ]
                })(<Input.Password placeholder="Enter your password." />)}
              </Form.Item>
            </>
            : children(props)
          }
        </Form>)}
    </ReauthenticateUserContext.Consumer>
  )
}