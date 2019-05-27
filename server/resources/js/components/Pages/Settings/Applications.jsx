import React from 'react'
import Base from '@layout/Base'
import { injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { withApollo, Query } from 'react-apollo'
import { Providers as GET_PROVIDERS } from '@graphql/Providers.graphql'
import { List, Avatar } from 'antd'
import { brandCDNLogo } from '@helpers/utils'
import { withModalConsumer } from '@modals'
import { ManageApplicationSettingsModal } from '@modals/Manage'

const providerList = ['twilio', 'facebook']

const messages = defineMessages({
  title: {
    id: 'app.settings.applications.title',
    defaultMessage: 'Applications',
  },
  description: {
    id: 'app.settings.applications.description',
    defaultMessage: 'None',
  },
})

class Applications extends React.Component {
  render() {
    const { showModal } = this.props
    return (
      <Query
        query={GET_PROVIDERS}
        variables={{
          keys: providerList,
        }}
      >
        {({ data, loading, error }) => (
          <Base messages={messages}>
            <List loading={loading} itemLayout="horizontal">
              {!loading &&
                data.providers.map(provider => {
                  return (
                    <List.Item
                      key={provider.key}
                      actions={[
                        <a
                          href="javascript:void(0)"
                          onClick={() => {
                            showModal(ManageApplicationSettingsModal, {
                              id: provider.id,
                            })
                          }}
                        >
                          Settings
                        </a>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="square"
                            size="large"
                            src={brandCDNLogo(provider.key)}
                          />
                        }
                        title={<a href="https://ant.design">{provider.name}</a>}
                        description={provider.description}
                      >
                        wtf?
                      </List.Item.Meta>
                    </List.Item>
                  )
                })}
            </List>
          </Base>
        )}
      </Query>
    )
  }
}

export default compose(
  injectIntl,
  withModalConsumer,
  withApollo
)(Applications)
