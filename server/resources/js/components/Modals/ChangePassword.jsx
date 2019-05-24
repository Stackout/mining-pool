import React, { Component } from 'react'
import {
  Modal,
  Icon,
  Button,
  Input,
  Typography,
  Form,
  Checkbox,
  message,
} from 'antd'
import { withApollo } from 'react-apollo'
import { injectIntl, defineMessages } from 'react-intl'
import { withModalConsumer } from '@modals'
import { compose } from 'recompose'
import Password, { ConfirmPassword } from '@fields/Password'
import { withFormProvider } from '@context/Form'
import { changePassword } from '@graphql/Auth.graphql'

const messages = defineMessages({
  title: {
    id: 'app.modal.change-password.title',
    defaultMessage: 'Change Password',
  },
  passwordsDoNotMatch: {
    id: 'app.modal.change-password.error.passwords-do-not-match',
    defaultMessage:
      'The old password does not match the current password on file, please try again.',
  },
  success: {
    id: 'app.modal.change-password.success',
    defaultMessage: 'You have successfully updated your password..',
  },
})

class ChangePassword extends Component {
  handleUpdatePassword = () => {
    const {
      onRequestClose,
      client,
      form,
      intl: { formatMessage },
    } = this.props

    form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({
          isSubmitting: true,
        })

        client
          .mutate({
            mutation: changePassword,
            variables: { data: values },
          })
          .then(({ data: { changePassword } }) => {
            if (changePassword.status === 'PASSWORD_CHANGE_FAILED') {
              message.error(formatMessage(messages.passwordsDoNotMatch))
            } else {
              onRequestClose && onRequestClose()
              message.success(formatMessage(messages.success))
            }
            this.setState({
              isSubmitting: false,
            })
          })
          .catch(error => {
            this.setState({
              isSubmitting: false,
            })
            message.error(error)
          })
      }
    })
  }

  state = {
    isSubmitting: false,
  }

  render() {
    const {
      onRequestClose,
      resource,
      intl: { formatMessage },
    } = this.props

    const { isSubmitting } = this.state

    return (
      <Modal
        title={[
          <div key="title">
            <Icon type="warning-circle" /> {formatMessage(messages.title)}
          </div>,
        ]}
        centered
        visible={true}
        onCancel={onRequestClose}
        footer={[
          <Button key="back" onClick={onRequestClose}>
            Cancel
          </Button>,
          <Button
            key="saveButton"
            type="primary"
            loading={isSubmitting}
            onClick={this.handleUpdatePassword}
          >
            Change Password
          </Button>,
        ]}
      >
        <Password
          name="old_password"
          nostrength
          icon="password"
          placeholder={'Old Password'}
        />
        <Password icon="password" placeholder={'New password'} />
        <ConfirmPassword icon="password" placeholder={'Confirm password'} />
      </Modal>
    )
  }
}

export default compose(
  injectIntl,
  withApollo,
  withFormProvider
)(ChangePassword)
