import React, { Component } from 'react'
import { Title, SubTitle } from './index'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import styled from '@emotion/styled'
import { Button, Upload, Form, Input, Spin, Checkbox } from 'antd'
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
  setSameAsBilling = event => {
    const { form } = this.props
    if (event.target.checked) {
      const billing = form.getFieldValue('billing')
      Object.entries(billing).map((entry, index) => {
        const [key, value] = entry
        form.setFieldsValue({ [`address.${key}`]: value })
      })
    }
  }

  render() {
    const {
      intl: { formatMessage },
      form,
      cookies,
    } = this.props
    return (
      <Query query={ME}>
        {({ data, loading, error }) => (
          <Spin spinning={loading}>
            <BasicContent>
              <Form>
                <Title>{formatMessage(messages.title)}</Title>
                <SubTitle>{formatMessage(messages.billingAddress)}</SubTitle>
                <Address name="billing" />
                <SubTitle>{formatMessage(messages.homeAddress)}</SubTitle>
                <Form.Item>
                  <Checkbox onChange={this.setSameAsBilling}>
                    Same as Billing
                  </Checkbox>
                </Form.Item>
                <Address name="address" />
                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Save Addresses
                  </Button>
                </Form.Item>
              </Form>
            </BasicContent>
          </Spin>
        )}
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
