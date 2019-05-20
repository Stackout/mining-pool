import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { debounce } from 'lodash'
import { injectIntl, defineMessages } from 'react-intl'
import { Form, Input, Icon } from 'antd'
import { EmailExists } from '@graphql/Users.graphql'
import { isEmail } from '@helpers/utils'
import { withFormContext } from '@context/Form'

const messages = defineMessages({
  title: {
    id: 'fields.email.label',
    defaultMessage: 'Email',
  },
  placeholder: {
    id: 'fields.email.placeholder',
    defaultMessage: 'Enter your email.',
  },
  invalidEmail: {
    id: 'fields.email.invalid',
    defaultMessage: 'The email you entered is not a valid email.',
  },
  required: {
    id: 'fields.email.required',
    defaultMessage: 'Please enter your email.',
  },
  exists: {
    id: 'fields.email.exists',
    defaultMessage: 'This email is already taken.',
  },
})

class Email extends Component {
  constructor(props) {
    super(props)

    this.checkEmail = debounce(this.checkEmail, 150)
  }

  checkEmail = (rule, value, callback) => {
    const {
      client,
      form,
      intl: { formatMessage },
    } = this.props

    if (value && isEmail(value)) {
      client
        .query({
          query: EmailExists,
          variables: { email: value },
        })
        .then(response => {
          const {
            data: { emailExists },
          } = response
          if (emailExists) {
            callback(formatMessage(messages.exists))
          } else {
            callback()
          }
        })
        .catch(error => {
          callback()
        })
    } else {
      callback()
    }
  }

  state = {
    checking: false,
  }

  render() {
    const {
      form,
      intl: { formatMessage },
      label,
    } = this.props
    return (
      <Form.Item label={label}>
        {form.getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: formatMessage(messages.invalidEmail),
            },
            {
              required: true,
              message: formatMessage(messages.required),
            },
            {
              validator: this.checkEmail,
            },
          ],
        })(
          <Input
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={formatMessage(messages.placeholder)}
          />
        )}
      </Form.Item>
    )
  }
}

export default compose(
  injectIntl,
  withFormContext,
  withApollo
)(Email)
