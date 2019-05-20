import React, { Component } from 'react'
import { Icon, Input } from 'antd'
import { compose } from 'recompose'
import { withFormContext } from '@context/Form'
import { injectIntl, defineMessages } from 'react-intl'
import { Form } from 'antd'

const messages = defineMessages({
  inputConfirmPassword: {
    id: 'fields.confirm-password',
    defaultMessage: 'Confirm Password',
  },
  inputConfirmPasswordPlaceholder: {
    id: 'fields.confirm-password.placeholder',
    defaultMessage: 'Enter a confirmation password.',
  },
  inputConfirmPasswordRequiredMessage: {
    id: 'fields.confirm-password.error.required',
    defaultMessage: 'Please confirm your password!',
  },
  inputConfirmPasswordErrorMessagePasswordCheck: {
    id: 'fields.confirm-password.error.password-check',
    defaultMessage: 'Two passwords that you entered are inconsistent!',
  },
})

class ConfirmPassword extends Component {
  checkPassword = (rule, value, callback) => {
    const {
      form,
      intl: { formatMessage },
    } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback(
        formatMessage(messages.inputConfirmPasswordErrorMessagePasswordCheck)
      )
    } else {
      callback()
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      intl: { formatMessage },
      required,
      handleConfirmBlur,
    } = this.props

    return (
      <Form.Item>
        {getFieldDecorator('password_confirmation', {
          rules: [
            {
              required,
              message: formatMessage(
                messages.inputConfirmPasswordRequiredMessage
              ),
            },
            {
              validator: this.checkPassword,
            },
          ],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={formatMessage(
              messages.inputConfirmPasswordPlaceholder
            )}
            type="password"
            onBlur={handleConfirmBlur}
          />
        )}
      </Form.Item>
    )
  }
}

export default compose(
  withFormContext,
  injectIntl
)(ConfirmPassword)
