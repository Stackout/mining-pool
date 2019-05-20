import React, { Component } from 'react'
import { PasswordInput } from 'antd-password-input-strength'
import { Icon } from 'antd'
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
    } = this.props

    return (
      <Form.Item>
        {' '}
        {getFieldDecorator('password', {
          rules: [
            { required: required || true, message: 'Please enter a password.' },
            { validator: this.checkConfirm },
          ],
        })(
          <PasswordInput
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your password."
          />
        )}
      </Form.Item>
    )
  }
}

export default compose(withFormContext)(Password)

export { default as ConfirmPassword } from './ConfirmPassword'
