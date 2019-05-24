import React from 'react'
import { List, Skeleton } from 'antd'
import { Title } from './index'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { ChangePassword, withModalConsumer } from '@modals'
import { compose } from 'recompose'
import { Query } from 'react-apollo'
import ME from '@graphql/Me.graphql'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import libphonenumber from 'google-libphonenumber'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const PNF = libphonenumber.PhoneNumberFormat

const messages = defineMessages({
  title: {
    id: 'accounts.security-settings.title',
    defaultMessage: 'Security Settings',
  },
  securityPhoneTitle: {
    id: 'accounts.security-settings.security-phone.title',
    defaultMessage: 'Security Mobile Phone',
  },
  securityPhoneWithoutNumber: {
    id: 'accounts.security-settings.security-phone.no-phone',
    defaultMessage:
      'Your account does not have a security mobile device. Consider adding one for better account security.',
  },
  securityPhoneWithNumber: {
    id: 'accounts.security-settings.security-phone.has-phone',
    defaultMessage: 'Bound mobile number: {security_phone}',
  },
  changePhoneNumber: {
    id: 'accounts.security-settings.security-phone.change-number',
    defaultMessage: 'Change Phone Number',
  },
  addPhoneNumber: {
    id: 'accounts.security-settings.security-phone.add-number',
    defaultMessage: 'Add Phone Number',
  },
})

const strongText = css`
  color: #52c41a;
`

const Security = ({ showModal, intl: { formatMessage } }) => {
  return (
    <Query query={ME}>
      {({ data, loading, error, refetch }) => (
        <>
          <Title>{formatMessage(messages.title)}</Title>
          <List itemLayout="horizontal">
            <List.Item
              actions={[
                <a
                  href="javascript:void(0)"
                  onClick={event => {
                    event.preventDefault()
                    showModal && showModal(ChangePassword)
                  }}
                >
                  Change Password
                </a>,
              ]}
              style={{ borderBottom: '1px solid rgb(232, 232, 232)' }}
            >
              <Skeleton loading={loading} active>
                <List.Item.Meta
                  title={'Account Password'}
                  description={
                    <>
                      Current password strength:{' '}
                      <span css={strongText}>Strong</span>
                    </>
                  }
                />
              </Skeleton>
            </List.Item>
            <List.Item
              actions={[
                <a
                  href="javascript:void(0)"
                  onClick={event => {
                    event.preventDefault()
                    showModal && showModal(ChangePhoneNumber)
                  }}
                >
                  {data.me && data.me.securityPhone
                    ? formatMessage(messages.changePhoneNumber)
                    : formatMessage(messages.addPhoneNumber)}
                </a>,
              ]}
              style={{ borderBottom: '1px solid rgb(232, 232, 232)' }}
            >
              <Skeleton loading={loading} active>
                <List.Item.Meta
                  title={'Security Mobile Phone'}
                  description={
                    <>
                      {!loading ? (
                        data.me.securityPhone ? (
                          <FormattedMessage
                            {...messages.securityPhoneWithNumber}
                            values={{
                              security_phone: phoneUtil.format(
                                phoneUtil.parse(data.me.securityPhone),
                                PNF.NATIONAL
                              ),
                            }}
                          />
                        ) : (
                          formatMessage(messages.securityPhoneWithoutNumber)
                        )
                      ) : (
                        formatMessage(messages.securityPhoneWithoutNumber)
                      )}
                    </>
                  }
                />
              </Skeleton>
            </List.Item>
          </List>
        </>
      )}
    </Query>
  )
}

export default compose(
  withModalConsumer,
  injectIntl
)(Security)
