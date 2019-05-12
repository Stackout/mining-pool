import React from 'react'
import { Table, Button } from 'antd'
import { Query } from 'react-apollo'
import GET_USERS from '@graphql/Users.graphql'
import { injectIntl, defineMessages } from 'react-intl'
import ActionGroup from '@layout/ListView/ActionGroup'

import { transformResource } from '@helpers/utils'

const message = defineMessages({
  name: {
    id: 'users.name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'users.email',
    defaultMessage: 'Email',
  },
  title: {
    id: 'users.pages.title',
    defaultMessage: 'Users',
  },
  userDetails: {
    id: 'users.pages.details',
    defaultMessage: 'View, update, create and delete a users resource.',
  },
})

const columns = formatMessage => {
  return [
    {
      title: formatMessage(message.name),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: formatMessage(message.email),
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: '250px',
      render: (text, record) => (
        <ActionGroup record={record} path="/manage/users" />
      ),
    },
  ]
}

class UsersListView extends React.Component {
  state = {
    page: 1,
    count: 10,
    term: undefined,
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props
    return (
      <Query
        query={GET_USERS}
        variables={{
          page: this.state.page,
          count: this.state.count,
        }}
      >
        {({ data, loading, error }) => {
          const paginatorInfo =
            !loading && !error ? data.users.paginatorInfo : {}
          const users =
            !loading && !error
              ? transformResource(data.users.data, ['name', 'email'])
              : []
          return (
            <>
              <Table
                columns={columns(formatMessage)}
                dataSource={users}
                loading={loading}
                onChange={(pagination, filters, sorter) => {
                  this.setState({
                    count: pagination.pageSize,
                    page: pagination.current,
                  })
                }}
                pagination={{
                  total: paginatorInfo.total,
                  pageSize: this.state.count,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30', '50', '100'],
                }}
              />
            </>
          )
        }}
      </Query>
    )
  }
}

export default injectIntl(UsersListView)
