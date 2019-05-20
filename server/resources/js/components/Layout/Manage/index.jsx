import React, { Component } from 'react'
import { PageHeader } from '@layout'
import { Typography, Card } from 'antd'
import { injectIntl } from 'react-intl'
import { ListViewProvider } from '@layout/ListView'
import { compose } from 'recompose'
import { CreateOrUpdateProvider } from '@context/CreateOrUpdate'

const { Paragraph } = Typography

class Manage extends Component {
  render() {
    const {
      intl: { formatMessage },
      message,
      breadcrumbs,
      children,
      queries,
      mutations,
      resource,
    } = this.props
    return (
      <>
        <PageHeader
          title={formatMessage(message.resourceTitle)}
          breadcrumb={{ breadcrumbs }}
        >
          <Paragraph>{formatMessage(message.resourceDetails)}</Paragraph>
        </PageHeader>
        <Card style={{ margin: '18px' }}>
          <CreateOrUpdateProvider
            query={queries.view}
            resourceName={resource}
            mutations={mutations}
          >
            <ListViewProvider
              query={queries.listView}
              deleteMutation={mutations.delete}
              resourceName={resource}
            >
              {children}
            </ListViewProvider>
          </CreateOrUpdateProvider>
        </Card>
      </>
    )
  }
}

export default compose(injectIntl)(Manage)
