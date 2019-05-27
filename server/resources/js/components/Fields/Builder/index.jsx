import React from 'react'
import { Input, Select, Form } from 'antd'
import { compose } from 'recompose'
import { withFormContext } from '@context/Form'

const Option = Select.Option

class FieldBuilder extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      value,
      name,
    } = this.props

    let field = JSON.parse(value)

    const fieldName = `${name}_name`
    const fieldLabel = `${name}_label`
    const fieldType = `${name}_type`

    return (
      <>
        <Form.Item
          validateStatus="warning"
          label="Field Name"
          help="Warning: Changing the field name can produce undesireable results."
        >
          {getFieldDecorator(fieldName, {
            initialValue: field && field.name ? field.name : '',
            rules: [{ required: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Field Label">
          {getFieldDecorator(fieldLabel, {
            initialValue: field && field.label ? field.label : '',
            rules: [{ required: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Field Type">
          {getFieldDecorator(fieldType, {
            initialValue: field && field.type ? field.type : 'input',
            rules: [{ required: true }],
          })(
            <Select style={{ width: '100%' }}>
              <Option key="input" value="input">
                Input
              </Option>
              <Option key="tag" value="tag">
                Tag
              </Option>
              <Option key="email" value="email">
                Email
              </Option>
              <Option key="textarea" value="textarea">
                TextArea
              </Option>
            </Select>
          )}
        </Form.Item>
      </>
    )
  }
}

export default compose(withFormContext)(FieldBuilder)
