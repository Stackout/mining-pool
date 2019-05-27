import React from 'react'
import Base from '@layout/Base'
import { injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  title: {
    id: 'app.settings.oauth.title',
    defaultMessage: 'OAuth',
  },
  description: {
    id: 'app.settings.oauth.description',
    defaultMessage: 'None',
  },
})

export default () => {
  return <Base messages={messages} />
}
