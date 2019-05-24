import React from 'react'
import { List } from 'antd'
import { Title } from './index'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { ChangePassword, withModalConsumer } from '@modals'
import { compose } from 'recompose'

const strongText = css`
  color: #52c41a;
`

const Security = ({ showModal }) => (
  <>
    <Title>Security Settings</Title>
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
        <List.Item.Meta
          title={'Account Password'}
          description={
            <>
              Current password strength: <span css={strongText}>Strong</span>
            </>
          }
        />
      </List.Item>
    </List>
  </>
)

export default compose(withModalConsumer)(Security)
