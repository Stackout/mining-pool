import React, { Component } from 'react'
import { Typography, Input, Form, Checkbox, Button, message } from 'antd'
import { compose } from 'recompose'
import { withFormContext } from '@context/Form'
import SmartphoneImage from '@assets/smartphone.svg'
import styled from '@emotion/styled'
import { validateCode } from '@graphql/Auth.graphql'
import { withApollo } from 'react-apollo'
import { withAuth } from './index';
import { transformRolesAndPermissions } from '@helpers/utils'

const { Title } = Typography

const SVGWrapper = styled.div`
  display:flex;
  width:100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`

const SVG = styled.img`
  width: 150px;
  transform: translate3d(55px, 0, 0);
`

class MultiFactorAuth extends Component {

  handleVerificationCode = (event) => {
    event.preventDefault()
    const { form, client, remember, username } = this.props

    this.setState({
      isSubmitting: true
    })

    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        client.mutate({
          mutation: validateCode,
          variables: {
            data: {
              username,
              remember,
              ...values
            },
          },
        })
          .then(response => {
            const {
              data: { validateCode },
            } = response

            if(validateCode.status === 'USER_AUTHENTICATED'){
              
              const [ roles, permissions ] = transformRolesAndPermissions(validateCode.meta)

              if (roles.length) {
                this.props.setAuthentication({
                  isAuthenticated: true,
                  roles,
                  permissions,
                })
                history.push('/')
              }
            } else {
              message.error('Your verification code was incorrect. Please try again.')
            }
            
            this.setState({
              isSubmitting: false
            })

          })
          .catch(error => {
            this.setState({
              isSubmitting: false
            })
          })
      } else {
      }
    })
    
  }

  render () {
  const {phone, form: { getFieldDecorator } } = this.props
  return (
    <>
      <SVGWrapper>
        <img src={SmartphoneImage} />
      </SVGWrapper>
      <Title level={4}>Enter a verification code</Title>
      <p>A text message with a verification code was just sent to <span style={{whiteSpace: 'nowrap', fontWeight: '700'}}>{phone}</span></p>
      <Form.Item>
      {getFieldDecorator('code', 
      {
        rules: [
          {required: true, message: 'Verification code is required before you can continue.',}
        ]
      })(<Input addonBefore="HXA-" />)}
      </Form.Item>
      <Form.Item >
        <Button block type="primary" onClick={this.handleVerificationCode}>Done</Button>
      </Form.Item>
      <Form.Item>
      {getFieldDecorator('remember_device', {

})(<Checkbox>Remember this computer for 30 days.</Checkbox>)}
      </Form.Item>
    </>
  )}
}


export default compose(
  withFormContext,
  withApollo,
  withAuth
)(MultiFactorAuth)