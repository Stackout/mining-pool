import React from 'react'
import { Button, Icon } from 'antd'
import { injectIntl, defineMessages } from 'react-intl'

const ButtonGroup = Button.Group

const messages = defineMessages({
  actionsEdit: {
    id: 'actions.edit',
    defaultMessage: 'Edit',
  },
  actionsDelete: {
    id: 'actions.delete',
    defaultMessage: 'Delete',
  },
})

const Actions = ({ intl: { formatMessage }, resource }) => (
  <ButtonGroup>
    <Button type="primary">
      <Icon type="edit" />
      {formatMessage(messages.actionsEdit)}
    </Button>
    <Button type="danger">
      <Icon type="delete" />
      {formatMessage(messages.actionsDelete)}
    </Button>
  </ButtonGroup>
)

export default injectIntl(Actions)
