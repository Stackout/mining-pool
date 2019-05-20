import React from 'react'
import { Button, Icon } from 'antd'
import { injectIntl, defineMessages } from 'react-intl'
import { Link } from 'react-router-dom'
import { injectModalConsumer, DeleteConfirmation } from '@modals'
import { compose } from 'recompose'

const ButtonGroup = Button.Group

const messages = defineMessages({
  actionsEdit: {
    id: 'actions.edit',
    defaultMessage: 'Edit',
  },
  actionsDelete: {
    id: 'actions.trash',
    defaultMessage: 'Trash',
  },
})

const Actions = ({
  intl: { formatMessage },
  resource,
  deleteMutation,
  showModal,
  refetchListView,
}) => (
  <ButtonGroup style={{ float: 'right' }}>
    <Button type="primary">
      <Link to={`/manage/users/${resource.id}`}>
        <Icon type="edit" />
        {formatMessage(messages.actionsEdit)}
      </Link>
    </Button>
    <Button
      type="danger"
      onClick={event => {
        showModal(DeleteConfirmation, {
          resource,
          deleteMutation,
          refetchListView,
        })
      }}
    >
      <Icon type="delete" />
      {formatMessage(messages.actionsDelete)}
    </Button>
  </ButtonGroup>
)

export default compose(
  injectIntl,
  injectModalConsumer
)(Actions)
