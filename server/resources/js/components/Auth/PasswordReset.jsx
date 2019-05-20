import React, { Component } from 'react'
import { compose } from 'recompose'
import { withApollo } from 'react-apollo'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import { withRouter, Link } from 'react-router-dom'
import { Form, Input, Icon, Button, message } from 'antd'
import { Title, CenteredActionText } from '@layout/Auth'
import { withFormProvider } from '@context/Form'
import Password, { ConfirmPassword } from '@fields/Password'
import { updatePassword } from '@graphql/Auth.graphql'
import { showErrorMessages } from '@helpers/utils'

const messages = defineMessages({
  updateForgottenPasswordSuccess: {
    id: 'update-forgotten-password.success',
    defaultMessage:
      'You have successfully updated your password. You may now login with your new credentials.',
  },
  updateForgottenPasswordError: {
    id: 'update-forgotten-password.error',
    defaultMessage:
      'You your password not was updated. We either cannot find a user with that email, or your password was not strong enough.',
  },
  updateForgottenPasswordTitle: {
    id: 'update-forgotten-password.title',
    defaultMessage: 'Reset your password',
  },
})

class PasswordReset extends Component {
  handleSubmit = event => {
    const {
      form,
      client,
      match,
      intl: { formatMessage },
      history,
    } = this.props
    event.preventDefault()
    this.setState({
      isSubmitting: true,
    })
    form.validateFields((errors, values) => {
      if (!errors) {
        client
          .mutate({
            mutation: updatePassword,
            variables: {
              data: {
                ...values,
                token: match.params.token,
              },
            },
          })
          .then(response => {
            const {
              status,
              message: statusMessage,
            } = response.data.updateForgottenPassword
            if (status === 'PASSWORD_UPDATED') {
              message.success(
                formatMessage(messages.updateForgottenPasswordSuccess)
              )
              setTimeout(() => {
                history.push('/login')
              }, 200)
              form.resetFields()
            } else if (status === 'PASSWORD_NOT_UPDATED') {
              message.error(statusMessage)
            }
            this.setState({
              isSubmitting: false,
            })
          })
          .catch(error => {
            console.error(error)
            this.setState({
              isSubmitting: false,
            })
          })
      } else {
        showErrorMessages(errors, message)
        this.setState({
          isSubmitting: false,
        })
      }
    })
  }

  state = {
    isSubmitting: false,
  }

  render() {
    const {
      form: { getFieldDecorator },
      intl: { formatMessage },
    } = this.props

    const { isSubmitting } = this.state

    return (
      <Form>
        <Title>{formatMessage(messages.updateForgottenPasswordTitle)}</Title>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not a valid E-mail!',
              },
              {
                required: true,
                message: 'Please enter your E-mail!',
              },
            ],
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter your email."
              type="email"
            />
          )}
        </Form.Item>
        <Password require={true} />
        <ConfirmPassword rquired={true} />
        <Form.Item>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={this.handleSubmit}
            htmlType="submit"
          >
            <FormattedMessage
              id="password-reset.submit"
              defaultMessage="Reset Password"
            />
          </Button>
        </Form.Item>
        <CenteredActionText>
          <Link to="/login">Back to Login</Link>
        </CenteredActionText>
      </Form>
    )
  }
}

export default compose(
  injectIntl,
  withApollo,
  withRouter,
  withFormProvider
)(PasswordReset)
