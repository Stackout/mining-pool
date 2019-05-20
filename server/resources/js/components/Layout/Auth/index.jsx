import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

export const Title = styled.h1`
  padding: 10px;
  margin: 22px 0px;
  width: 100%;
  text-align: center;
  font-size: 25px;
`

export const SlideIn = keyframes`
  0%   { 
    transform: translateX(200%); 		
  }
  100% { 
    transform: translateX(0%); 
  }
`

export const AuthPanel = styled.div`
  background-color: #fff;
  width: 40%;

  display: block;
  padding: 40px;
  -webkit-box-shadow: 0px 0px 14px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 14px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 14px -1px rgba(0, 0, 0, 0.75);
  overflow: hidden;
  max-width: 500px;
  min-width: 500px;
`

export const LoginFormForgot = styled.div`
  float: right;
`

export const CenteredActionText = styled.div`
  width: 100%;
  min-height: 20px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
