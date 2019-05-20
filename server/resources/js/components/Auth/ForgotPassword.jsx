import React, { Component } from 'react'
import { Title, CenteredActionText } from '@layout/Auth'
import { Link } from 'react-router-dom'
import { Form, Input, Icon, Button, Spin } from 'antd'
import { withApollo } from 'react-apollo'
import { forgotPassword } from '@graphql/Auth.graphql'
import {
  defineMessages,
  injectIntl,
  FormattedHTMLMessage,
  FormattedMessage,
} from 'react-intl'
import { compose } from 'recompose'

const messages = defineMessages({
  title: {
    id: 'forgot.password.step-1.title',
    defaultMessage: 'Forgot your password?',
  },
  description: {
    id: 'forgot.password.step-1',
    defaultMessage:
      "Don't worry. Resetting your password is east, just tell us the email address you registered with us.",
  },
  titleStep2: {
    id: 'forgot.password.step-2.title',
    defaultMessage: 'Reset Your Password',
  },
  resendLinkText: {
    id: 'forgot.password.resend-link-text',
    defaultMessage: 'resend',
  },
})

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = event => {
    event.preventDefault()
    const { form, client } = this.props

    this.setState({
      isSubmitting: true,
    })

    form.validateFields((error, values) => {
      if (!error) {
        client
          .mutate({
            mutation: forgotPassword,
            variables: {
              data: values,
            },
          })
          .then(response => {
            this.setState({
              step: 2,
              isSubmitting: false,
            })
          })
          .catch(error => {
            console.error('[Forgot Password] Internal Server Error.', error)
            this.setState({
              isSubmitting: false,
            })
          })
      } else {
        this.setState({
          isSubmitting: false,
        })
      }
    })
  }

  state = {
    step: 1,
    isSubmitting: false,
  }

  transformStep3Text = message => {
    const {
      getFieldValue,
      intl: { formatMessage },
    } = this.props
    const { isSubmitting } = this.state
    let parts = message.split(/\|([^}]*)\|/g)
    return (
      <div>
        {parts.map((part, index) =>
          part !== 'RESEND_LINK' ? (
            <span key={index}>{part}</span>
          ) : (
            <a href="" key={index} onClick={this.handleSubmit}>
              {formatMessage(messages.resendLinkText)}
            </a>
          )
        )}
      </div>
    )
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      intl: { formatMessage },
    } = this.props
    const { step, isSubmitting } = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Title>
          {formatMessage(step === 1 ? messages.title : messages.titleStep2)}
        </Title>
        {step === 1 ? (
          <p>{formatMessage(messages.description)}</p>
        ) : (
          <Spin spinning={isSubmitting}>
            <p>
              <FormattedHTMLMessage
                id="forgot.password.step-2"
                defaultMessage="We have sent a reset password email to <b>{email}</b>. Please click the reset password link to set your new password."
                values={{ email: getFieldValue('email') }}
              />
            </p>
            <FormattedMessage
              id="forgot.password.step-3"
              defaultMessage="Didn't receive the email yet? Please check your spam folder, or |RESEND_LINK| the email."
            >
              {message => <>{this.transformStep3Text(message)}</>}
            </FormattedMessage>
          </Spin>
        )}
        <div style={{ display: step === 2 && 'none' }}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                { required: true, message: 'Please enter your email!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Enter your Email"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={isSubmitting} htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </div>
        <CenteredActionText>
          <span>
            <Link to="/login">Back to Login</Link>
          </span>
          <span>- or -</span>
          <span>
            <Link to="/register">Create an Account</Link>
          </span>
        </CenteredActionText>
      </Form>
    )
  }
}

export default compose(
  Form.create({ name: 'forgot_password' }),
  injectIntl,
  withApollo
)(ForgotPassword)
