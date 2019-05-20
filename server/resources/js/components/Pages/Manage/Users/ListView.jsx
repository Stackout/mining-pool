import React from 'react'
import { Table, Tabs, Icon } from 'antd'
import { injectIntl, defineMessages } from 'react-intl'
import ActionGroup from '@layout/ListView/ActionGroup'
import { withListViewConsumer } from '@layout/ListView'
import { compose } from 'recompose'
import { transformResource } from '@helpers/utils'

const TabPane = Tabs.TabPane

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

const columns = ({ formatMessage, deleteMutation, refetchListView }) => {
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
      width: '200px',
      render: (text, record) => (
        <ActionGroup
          resource={record}
          deleteMutation={deleteMutation}
          refetchListView={refetchListView}
        />
      ),
    },
  ]
}

const ListView = ({
  intl: { formatMessage },
  count,
  handlePageChange,
  data,
  loading,
  deleteMutation,
  refetch: refetchListView,
}) => {
  const { users, paginatorInfo } = transformResource('users', data, [
    'name',
    'email',
    'id',
  ])

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="List View" key="1">
          <Table
            columns={columns({
              formatMessage,
              deleteMutation,
              refetchListView,
            })}
            dataSource={users}
            loading={loading}
            onChange={handlePageChange}
            pagination={{
              total: paginatorInfo.total,
              pageSize: count,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="delete" />
              Trash (5)
            </span>
          }
          key="2"
        >
          Deleted Items here in the Trash
        </TabPane>
      </Tabs>
    </div>
  )
}

export default compose(
  injectIntl,
  withListViewConsumer
)(ListView)
