import React, { Component } from 'react'
import { Mutation, withApollo } from 'react-apollo'
import { register } from '@graphql/Auth.graphql'
import { compose } from 'recompose'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { withFormProvider } from '@context/Form'
import { Form, Input, Icon, Button, message } from 'antd'
import { Title, CenteredActionText } from '@layout/Auth'
import { Link, withRouter } from 'react-router-dom'
import Password, { ConfirmPassword } from '@fields/Password'
import Email from '@fields/Email'

const messages = defineMessages({
  title: {
    id: 'register.title',
    defaultMessage: 'Create an Account',
  },
  fieldNameRequired: {
    id: 'field.name.required',
    defaultMessage: 'Please enter your name.',
  },
  fieldNamePlaceholder: {
    id: 'field.name.placholder',
    defaultMessage: 'Enter your full name.',
  },
  registerSuccess: {
    id: 'register.success',
    defaultMessage:
      'You have successfully registerd an account. We sent you an activation link to your email. Please check your email for the activation link.',
  },
})

class Register extends Component {
  handleSubmit = event => {
    event.preventDefault()
    const {
      form,
      client,
      history,
      intl: { formatMessage },
    } = this.props
    this.setState({
      isSubmitting: true,
    })
    form.validateFields((errors, values) => {
      if (!errors) {
        client
          .mutate({
            mutation: register,
            variables: {
              data: values,
            },
          })
          .then(response => {
            this.setState({
              isSubmitting: false,
            })
            message.success(formatMessage(messages.registerSuccess))
            history.push('/login')
          })
          .catch(error => {
            console.error(`[Account Creation Error]: ${error}`)
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
    isSubmitting: false,
  }

  render() {
    const {
      intl: { formatMessage },
      form,
    } = this.props

    const { isSubmitting } = this.state

    return (
      <Form>
        <Title>{formatMessage(messages.title)}</Title>
        <Email />
        <Form.Item>
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage(messages.fieldNameRequired),
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={formatMessage(messages.fieldNamePlaceholder)}
            />
          )}
        </Form.Item>
        <Password required={true} />
        <ConfirmPassword required={true} />
        <Form.Item>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={this.handleSubmit}
            htmlType="submit"
          >
            <FormattedMessage
              id="register.submit"
              defaultMessage="Create Account"
            />
          </Button>
        </Form.Item>
        <CenteredActionText>
          <Link to="/login">Back to login</Link>
        </CenteredActionText>
      </Form>
    )
  }
}

export default compose(
  injectIntl,
  withApollo,
  withFormProvider,
  withRouter
)(Register)
