import React from 'react'
import styled from '@emotion/styled'
import SelectLang from '../SelectLang'

const RightContent = styled.div`
  float: right;
  height: 100%;
  overflow: hidden;
`

export default () => (
  <RightContent>
    <SelectLang />
  </RightContent>
)
