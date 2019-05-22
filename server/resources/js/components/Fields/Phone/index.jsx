import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { debounce } from 'lodash'
import { injectIntl, defineMessages } from 'react-intl'
import { Form, Input, Icon } from 'antd'
import { formatPhoneNumber } from '@helpers/utils'
import { withFormContext } from '@context/Form'
import MaskedInput from 'react-text-mask'

const messages = defineMessages({
  title: {
    id: 'fields.phone.label',
    defaultMessage: 'Phone',
  },
  required: {
    id: 'fields.phone.required',
    defaultMessage: 'Phone number is required.',
  },
  placeholder: {
    id: 'fields.phone.placeholder',
    defaultMessage: 'Enter a Phone number',
  },
})

class Phone extends Component {

  state = {
    number: false,
  }

  render() {
    const {
      form: { setFieldsValue, getFieldProps, getFieldValue },
      intl: { formatMessage },
      label,
      initialValue,
      name
    } = this.props
    return (
      <Form.Item label={label}>
        <MaskedInput
          mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          guide={false}
          value={initialValue}
          showMask
          render={(ref, props) => {
            const { value } = getFieldProps(name)
            return (
            <Input
              name={name}
              prefix={<Icon type="phone" />}
              value={value}
              ref={(input) => ref(input && input.input)}
              {...props}
              onChange={(event) => {
                props.onChange(event)
                setFieldsValue({
                  [name]: event.target.value
                })
              }}
            />
          )}}
        />
      </Form.Item>
    )
  }
}

export default compose(
  injectIntl,
  withFormContext,
  withApollo
)(Phone)
