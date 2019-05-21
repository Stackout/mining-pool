import React from 'react'
import { Title } from './index'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import styled from '@emotion/styled'
import { Button, Upload, Form, Input } from 'antd'
import Email from '@fields/Email'
import { withFormProvider } from '@context/Form'
import Address from '@fields/Address'
import { withCookies } from 'react-cookie'

const messages = defineMessages({
  title: {
    id: 'accounts.settings.title',
    defaultMessage: 'Basic Settings',
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

const avatarUploadProps = token => ({
  name: 'file',
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
  },
  action: '/upload/avatar',
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
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
  render() {
    const {
      intl: { formatMessage },
      form,
      cookies,
    } = this.props
    return (
      <BasicContent>
        <LeftContent>
          <Title>{formatMessage(messages.title)}</Title>
          <Form layout={'vertical'}>
            <Email label="Email" />
            <Form.Item label="Name">
              {form.getFieldDecorator('Name')(<Input />)}
            </Form.Item>
            <Form.Item label="Phone">
              {form.getFieldDecorator('phone')(<Input />)}
            </Form.Item>
            <Address />
          </Form>
        </LeftContent>
        <RightContent>
          <AvatarContent>
            <AvatarWrapper>
              <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
            </AvatarWrapper>
            <Upload {...avatarUploadProps(cookies.get('token'))}>
              <Button icon="upload" type="primary">
                {formatMessage(messages.avatarButton)}
              </Button>
            </Upload>
          </AvatarContent>
        </RightContent>
      </BasicContent>
    )
  }
}

export default compose(
  injectIntl,
  withFormProvider,
  withCookies
)(BasicSettings)
