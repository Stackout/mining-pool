import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { withFormProvider } from '@context/Form'
import { compose } from 'recompose'
import { Modal, Form, Input, Icon, Button } from 'antd'
import { withReauthenticateUser, ReauthenticateUser } from '@auth/ReauthenticateUser';
import Phone from '@fields/Phone'

class ChangeSecurityPhoneModal extends Component {

  handlePasswordChange = () => {

  }

  state = {
    isSubmitting: false
  }

  render() {
    const { form: { getFieldDecorator }, onRequestClose, isAuthenticated, isAuthenticating, handleAuthentication } = this.props
    const { isSubmitting } = this.state

    return (
      <Modal 
        title={[
          <div key="title">
            <Icon type="warning-circle" /> Change Security Phone
          </div>,
        ]}
        footer={[
          <Button key="back" onClick={onRequestClose}>
            Cancel
          </Button>,
          <Button
            key="saveButton"
            type="primary"
            loading={isAuthenticating || isSubmitting}
            onClick={(event) => {
              if(!isAuthenticated){
                handleAuthentication(event)
              } else { 
                this.handlePasswordChange(event)
              }
            }}
          >
            {!isAuthenticated ? 'Continue' : 'Change Phone'}
          </Button>,
        ]}
        centered
        visible={true}
        onCancel={onRequestClose}
      >
        <ReauthenticateUser>
          {(props) => {
            return (
            <>
                <Phone name="phone" />
              </>
            )
          }}
        </ReauthenticateUser>
      </Modal>
    )
  }
}

export default compose(withReauthenticateUser)(ChangeSecurityPhoneModal)