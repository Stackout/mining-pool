import React, { Component } from 'react'
import { PageHeader } from '@layout'
import { Typography, Card } from 'antd'
import { injectIntl } from 'react-intl'

const { Paragraph } = Typography

class Manage extends Component {
  render() {
    const {
      intl: { formatMessage },
      message,
      breadcrumbs,
      children,
    } = this.props
    return (
      <>
        <PageHeader
          title={formatMessage(message.resourceTitle)}
          breadcrumb={{ breadcrumbs }}
        >
          <Paragraph>{formatMessage(message.resourceDetails)}</Paragraph>
        </PageHeader>
        <Card style={{ margin: '18px' }}>{children}</Card>
      </>
    )
  }
}

export default injectIntl(Manage)
