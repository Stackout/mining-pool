import React from 'react'
import { Title } from './index'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import styled from '@emotion/styled'
import { Button, Upload, Form, Input, Spin, InputNumber } from 'antd'
import Email from '@fields/Email'
import Phone from '@fields/Phone'
import { withFormProvider } from '@context/Form'
import { withApollo, Query } from 'react-apollo'
import Address from '@fields/Address'
import { withCookies } from 'react-cookie'
import ME from '@graphql/Me.graphql'
import { updateProfile } from '@graphql/Auth.graphql'
import { formatPhoneNumber } from '@helpers/utils'

const messages = defineMessages({
  title: {
    id: 'accounts.settings.title',
    defaultMessage: 'Profile',
  },
  avatarButton: {
    id: 'accounts.settings.avatarButton',
    defaultMessage: 'Change Avatar',
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

const Avatar = styled.img`
  width: 100%;
`

const avatarUploadProps = client => ({
  name: 'file',
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
  },
  action: '/upload/avatar',
  onChange(info) {
    if (info.file.status !== 'uploading') {
      client && client()
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} avatar uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} avatar upload failed.`)
    }
  },
})

const RightContent = styled.div`
  width: 30%;
`

const LeftContent = styled.div`
  width: 70%;
`

const BasicContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`

class BasicSettings extends React.Component {
  handleSaveProfile = () => {
    const {
      form,
      client,
      history,
      intl: { formatMessage },
    } = this.props

    this.setState({
      isSubmitting: true,
    })

    form.validateFields((errors, values) => {
      if (!errors) {
        client
          .mutate({
            mutation: updateProfile,
            variables: {
              data: values,
            },
          })
          .then(response => {
            console.log(response)
          })
      }
    })
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
              {(() => {
                console.log(data)
              })()}
              <LeftContent>
                <Title>{formatMessage(messages.title)}</Title>
                <Form
                  layout={'vertical'}
                  onSubmit={event => {
                    event.preventDefault()
                    this.handleSaveProfile()
                  }}
                >
                  <Form.Item label="Name">
                    <Input value={data.me && data.me.name} disabled />
                  </Form.Item>
                  <Phone
                    label="Phone Number"
                    name="phone"
                    initialValue={data.me ? data.me.profile.phone : 'none'}
                  />
                  <Form.Item label="Biography">
                    {form.getFieldDecorator('bio')(<Input />)}
                  </Form.Item>
                  <Form.Item label="Website">
                    {form.getFieldDecorator('website')(<Input />)}
                  </Form.Item>
                  <Form.Item>
                    <Button block type="primary" htmlType="submit">
                      Save Profile
                    </Button>
                  </Form.Item>
                </Form>
              </LeftContent>
              <RightContent>
                <AvatarContent>
                  <AvatarWrapper>
                    <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                  </AvatarWrapper>
                  <Upload {...avatarUploadProps()}>
                    <Button icon="upload" type="primary">
                      {formatMessage(messages.avatarButton)}
                    </Button>
                  </Upload>
                </AvatarContent>
              </RightContent>
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
)(BasicSettings)
