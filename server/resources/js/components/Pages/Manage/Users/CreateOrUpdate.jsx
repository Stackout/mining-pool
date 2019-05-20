import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import Roles from '@fields/Roles'
import CreateOrUpdate from '@context/CreateOrUpdate'

const FormItem = Form.Item

export class ManageResource extends Component {
  render() {
    return (
      <CreateOrUpdate>
        {({
          resource,
          fieldDecorator,
          formItemLayout,
          checkPassword,
          checkConfirm,
          handleConfirmBlur,
          isEditing,
          loading,
          handleLoadingCallback,
        }) => (
          <>
            <Form.Item label="Full Name">
              {fieldDecorator('name', {
                initialValue: isEditing && !loading ? resource.user.name : '',
                rules: [
                  {
                    required: true,
                    message: 'Please input a name!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="E-mail">
              {fieldDecorator('email', {
                initialValue: isEditing && !loading ? resource.user.email : '',
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <FormItem {...formItemLayout} label="Password" hasFeedback>
              {fieldDecorator('password', {
                rules: [
                  {
                    required: !isEditing,
                    message: 'Please input your password!',
                  },
                  {
                    validator: checkConfirm,
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Confirm Password" hasFeedback>
              {fieldDecorator('password_confirmation', {
                rules: [
                  {
                    required: !isEditing,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: checkPassword,
                  },
                ],
              })(<Input type="password" onBlur={handleConfirmBlur} />)}
            </FormItem>
            <Roles
              fieldDecorator={fieldDecorator}
              initialValue={isEditing && !loading ? resource.user.roles : []}
              onLoading={handleLoadingCallback}
            />
          </>
        )}
      </CreateOrUpdate>
    )
  }
}

export default ManageResource
