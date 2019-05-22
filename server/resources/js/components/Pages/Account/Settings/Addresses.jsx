import React, { Component } from 'react'
import { Title, SubTitle } from './index'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import styled from '@emotion/styled'
import { Button, Upload, Form, Input, Spin } from 'antd'
import { withFormProvider } from '@context/Form'
import { withApollo, Query } from 'react-apollo'
import Address from '@fields/Address'
import { withCookies } from 'react-cookie'
import ME from '@graphql/Me.graphql'

const messages = defineMessages({
  title: {
    id: 'accounts.addresses.title',
    defaultMessage: 'Addresses',
  },
  billingAddress: {
    id: 'accounts.addresses.billing',
    defaultMessage: 'Billing Address',
  },
  homeAddress: {
    id: 'accounts.addresses.home',
    defaultMessage: 'Home Address',
  },
})

const AvatarContent = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  flex-direction: column;
`

const AvatarWrapper = styled.div`
  width: 144px;
  height: 144px;
  margin-bottom: 12px;
  overflow: hidden;
`

const BasicContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`

class Addresses extends Component {
  render() {
    const {
      intl: { formatMessage },
      form,
      cookies,
    } = this.props
    return (
      <Query
        query={ME}
      >
      {({ data, loading, error }) => (
      <Spin spinning={loading}>
        <BasicContent>
          <Form>
            <Title>{formatMessage(messages.title)}</Title>
              <SubTitle>{formatMessage(messages.homeAddress)}</SubTitle>
              <Address index={0} name="addresses" />
              <SubTitle>{formatMessage(messages.billingAddress)}</SubTitle>
              <Address index={1} name="addresses" />
            </Form>
        </BasicContent>
      </Spin>)}
      </Query>
    )
  }
}

export default compose(
  injectIntl,
  withFormProvider,
  withCookies,
  withApollo
)(Addresses)
