import React, { Component } from 'react'
import { PasswordInput } from 'antd-password-input-strength'
import { Icon, Input } from 'antd'
import { compose } from 'recompose'
import { withFormContext } from '@context/Form'
import { Form } from 'antd'

class Password extends Component {
  checkConfirm = (rule, value, callback) => {
    const { form, confirmDirty } = this.props
    if (value && confirmDirty) {
      form.validateFields(['password_confirmation'], { force: true })
    }
    callback()
  }

  render() {
    const {
      form: { getFieldDecorator },
      required,
      nostrength,
      placeholder,
      name,
    } = this.props
    const icon = <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
    return (
      <Form.Item>
        {' '}
        {getFieldDecorator(name ? name : 'password', {
          rules: [
            { required: required || true, message: 'Please enter a password.' },
            { validator: this.checkConfirm },
          ],
        })(
          !nostrength ? (
            <PasswordInput
              prefix={icon}
              placeholder={placeholder ? placeholder : 'Enter your password.'}
            />
          ) : (
            <Input
              type="password"
              prefix={icon}
              placeholder={placeholder ? placeholder : 'Enter your password.'}
            />
          )
        )}
      </Form.Item>
    )
  }
}

export default compose(withFormContext)(Password)

export { default as ConfirmPassword } from './ConfirmPassword'
