import React from 'react'
import styled from '@emotion/styled'
import SelectLang from '../SelectLang'
import { Query } from 'react-apollo'
import ME from '@graphql/Me.graphql'
import { Spin } from 'antd'
import UserDropDown from './UserDropDown'

const RightContent = styled.div`
  float: right;
  height: 100%;
  display: flex;
  flex-direction: row;
`

const ActionContainer = styled.div`
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }
`

const Action = ({ component: Component, ...props }) => (
  <ActionContainer>
    <Component {...props} />
  </ActionContainer>
)

export default () => (
  <Query query={ME} fetchPolicy="network-only">
    {({ data, loading, error }) => (
      <RightContent>
        <ActionContainer>
          {!loading ? (
            <UserDropDown user={data.me} />
          ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
          )}
        </ActionContainer>
        <Action component={SelectLang} />
      </RightContent>
    )}
  </Query>
)
