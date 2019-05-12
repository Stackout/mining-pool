import React from 'react'
import { defineMessages } from 'react-intl'
import ListView from './ListView'
import Manage from '@layout/Manage'
import { UserRoutes } from '@routes/Manage'

const message = defineMessages({
  resourceTitle: {
    id: 'users.resource.title',
    defaultMessage: 'Users',
  },
  resourceDetails: {
    id: 'users.resource.details',
    defaultMessage: 'View, update, create and delete a users resource.',
  },
})

const routes = [
  {
    path: 'index',
    breadcrumbName: 'Dashboard',
  },
  {
    path: 'first',
    breadcrumbName: 'Users',
  },
]

export default ({ match }) => (
  <Manage message={message} breadcrumbs={routes}>
    <UserRoutes match={match} listView={ListView} />
  </Manage>
)
