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
import { compose } from 'recompose'

const { Text } = Typography

const messages = defineMessages({
  title: {
    id: 'app.modal.deleteConfirmationTitle',
    defaultMessage: 'Delete Resource',
  },
  description: {
    id: 'app.modal.deleteConfirmationDescription',
    defaultMessage:
      'Force deleting removes all data and files associated with this resource. There is no going back, so please be certain. Not checking this box will soft delete this resource.',
  },
})

class DeleteConfirmation extends Component {
  handleDeleteResource = () => {
    const {
      onRequestClose,
      resource,
      deleteMutation,
      client,
      refetchListView,
    } = this.props

    this.setState({
      isDeleting: true,
      response: undefined,
    })

    client
      .mutate({
        mutation: deleteMutation,
        variables: {
          id: resource.id,
        },
      })
      .then(response => {
        this.setState(
          {
            isDeleting: false,
            response,
          },
          () => {
            refetchListView && refetchListView()
            onRequestClose && onRequestClose()
          }
        )

        message.success(`You successfully deleted this resource.`)
      })
      .catch(error => {
        this.setState({
          isDeleting: false,
        })
        console.error(error)
      })
  }

  checkName = () => {
    const { name } = this.state
    const { resource } = this.props

    return name !== resource.name
  }

  handleNameChange = event => {
    this.setState({
      name: event.target.value,
    })
  }

  state = {
    name: '',
    isDeleting: undefined,
  }

  render() {
    const {
      onRequestClose,
      resource,
      intl: { formatMessage },
    } = this.props

    const { name, isDeleting } = this.state

    return (
      <Modal
        title={[
          <div key="title">
            <Icon type="warning-circle" /> {formatMessage(messages.title)} -{' '}
            {resource.name}
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
            key="deleteButton"
            icon="delete"
            type="danger"
            loading={isDeleting}
            disabled={this.checkName()}
            onClick={this.handleDeleteResource}
          >
            Delete
          </Button>,
        ]}
      >
        <p>
          If you are sure you want to delete this resource, type{' '}
          <Text code>{resource.name}</Text> in the input below.
        </p>
        <Form.Item>
          <Input placeholder={resource.name} onChange={this.handleNameChange} />
        </Form.Item>
        <p>{formatMessage(messages.description)}</p>
        <Form.Item>
          <Checkbox value="force-delete">Force Delete</Checkbox>
        </Form.Item>
      </Modal>
    )
  }
}

export default compose(
  withApollo,
  injectIntl
)(DeleteConfirmation)
