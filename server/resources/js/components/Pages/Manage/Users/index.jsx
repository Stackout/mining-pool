import React from 'react'
import { defineMessages } from 'react-intl'
import ListView from './ListView'
import CreateOrUpdate from './CreateOrUpdate'
import Manage from '@layout/Manage'
import { UserRoutes } from '@routes/Manage'
import { Users as GET_USERS, User as GET_USER } from '@graphql/Users.graphql'
import {
  createUser,
  updateUser,
  deleteUser,
} from '@graphql/UserMutations.graphql'

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
  <Manage
    message={message}
    breadcrumbs={routes}
    queries={{
      listView: GET_USERS,
      view: GET_USER,
    }}
    mutations={{
      create: createUser,
      update: updateUser,
      delete: deleteUser,
    }}
    resource={'users'}
  >
    <UserRoutes
      match={match}
      listView={ListView}
      createOrUpdate={CreateOrUpdate}
    />
  </Manage>
)
