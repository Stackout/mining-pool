import React from 'react'
import styled from '@emotion/styled'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { Mutation } from 'react-apollo'
import { login } from '@graphql/Auth.graphql'
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { compose } from 'recompose'
import { withCookies } from 'react-cookie'
import { withAuth } from '@auth'
import { Link } from 'react-router-dom'
import {
  SlideIn,
  LoginFormForgot,
  Title,
  CenteredActionText,
} from '@layout/Auth'
import { transformRolesAndPermissions } from '@helpers/utils'
import MultiFactorAuth from './MultiFactorAuth'
import { withFormProvider } from '@context/Form'

class LoginForm extends React.Component {
  handleSubmit = (event, login) => {
    event.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        login({
          variables: {
            data: values,
          },
        })
          .then(response => {
            const {
              data: { login },
            } = response

            if (login.status === 'DEVICE_NOT_TRUSTED') {
              this.setState({
                step: 'deviceNotTrusted',
                phone: login.meta.phone,
                remember: values.remember,
                username: values.username,
              })
            }

            const [roles, permissions] = transformRolesAndPermissions(
              login.meta
            )
            if (roles.length) {
              this.props.setAuthentication({
                isAuthenticated: true,
                permissions,
                roles,
              })
              history.push('/')
            }
          })
          .catch(error => {
            this.error = 'Username and/or password is incorrect'
          })
      } else {
      }
    })
  }

  state = {
    step: null,
  }

  render() {
    const {
      form: { getFieldDecorator },
      cookies,
    } = this.props
    const { step, phone, username, remember } = this.state
    return (
      <Mutation mutation={login}>
        {(login, { data, loading, error }) => (
          <>
            {/* BASIC LOGIN STEP */}
            {!step && (
              <>
                <Title>Login</Title>
                <Form onSubmit={event => this.handleSubmit(event, login)}>
                  <Form.Item>
                    {getFieldDecorator('username', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your email!',
                        },
                      ],
                    })(
                      <Input
                        css={css`
                          animation: ${SlideIn} 0.5s ease;
                        `}
                        prefix={
                          <Icon
                            type="mail"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder="Email"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your Password!',
                        },
                      ],
                    })(
                      <Input
                        css={css`
                          animation: ${SlideIn} 0.7s ease;
                        `}
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <LoginFormForgot>
                      <Link to="/forgot-password">Forgot Password</Link>
                    </LoginFormForgot>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: '100%',
                      }}
                      loading={loading}
                    >
                      Login
                    </Button>
                    <CenteredActionText>
                      <span>Don't have an account?</span>
                      <span style={{ marginLeft: '8px' }}>
                        <Link to="/register">Sign up</Link>
                      </span>
                    </CenteredActionText>
                  </Form.Item>
                </Form>
              </>
            )}
            {/* MULTIFACTOR AUTH STEP DEVICE_NOT_TRUSTED */}
            {step === 'deviceNotTrusted' && (
              <>
                <MultiFactorAuth
                  phone={phone}
                  username={username}
                  remember={remember}
                />
              </>
            )}
          </>
        )}
      </Mutation>
    )
  }
}

export default compose(
  withCookies,
  withAuth,
  withFormProvider
)(LoginForm)
