import React, { Component } from 'react'
import { PageHeader } from '@layout'
import { Typography, Card } from 'antd'
import { injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'

const { Paragraph } = Typography

class Base extends Component {
  render() {
    const {
      intl: { formatMessage },
      messages,
      breadcrumbs,
      children,
    } = this.props

    return (
      <>
        <PageHeader
          title={formatMessage(messages.title)}
          breadcrumb={{ breadcrumbs }}
        >
          <Paragraph>{formatMessage(messages.description)}</Paragraph>
        </PageHeader>
        <Card style={{ margin: '18px' }}>{children}</Card>
      </>
    )
  }
}

export default compose(injectIntl)(Base)
