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
              const [ roles, permissions ] = transformRolesAndPermissions(login)
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

  render() {
    const {
      form: { getFieldDecorator },
      cookies,
    } = this.props
    return (
      <Mutation mutation={login}>
        {(login, { data, loading, error }) => (
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
                      <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
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
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
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
      </Mutation>
    )
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm)

export default compose(
  withCookies,
  withAuth
)(WrappedLoginForm)
