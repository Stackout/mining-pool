import React, { Component } from 'react'
import { Modal, Icon, Button } from 'antd'
import { injectIntl } from 'react-intl'
import { compose } from 'recompose'
import CreateOrUpdate, { CreateOrUpdateProvider } from '@context/CreateOrUpdate'

class ManageModal extends Component {
  render() {
    const {
      intl: { formatMessage },
      messages,
      children,
      queries,
      mutations,
      resourceName,
      onRequestClose,
      resourceId,
    } = this.props
    return (
      <CreateOrUpdateProvider
        query={queries.view}
        resourceName={resourceName}
        mutations={mutations}
      >
        <CreateOrUpdate
          disableDefaultFormSubmit={false}
          layout="verticle"
          onRequestClose={onRequestClose}
          resourceId={resourceId}
        >
          {props => (
            <Modal
              show
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
                  htmlType="submit"
                  onClick={event => {
                    props.handleSubmit(
                      event,
                      props.mutate,
                      'Resource was successfully updated.'
                    )
                  }}
                  loading={props.isSubmitting}
                >
                  {props.isEditing ? 'Update' : 'Create'}
                </Button>,
              ]}
            >
              {children(props)}
            </Modal>
          )}
        </CreateOrUpdate>
      </CreateOrUpdateProvider>
    )
  }
}

export default compose(injectIntl)(ManageModal)

export {
  default as ManageApplicationSettingsModal,
} from './ApplicationSettings'
