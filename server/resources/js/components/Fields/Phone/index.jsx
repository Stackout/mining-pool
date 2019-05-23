import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import { Form, Input, Icon, Select } from 'antd'
import { withFormContext } from '@context/Form'
import MaskedInput from 'react-text-mask'
import Flag from 'react-country-flag'
import countries from '@helpers/locale/countries.json'
import libphonenumber from 'google-libphonenumber'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

const Option = Select.Option

const messages = defineMessages({
  title: {
    id: 'fields.phone.label',
    defaultMessage: 'Phone',
  },
  required: {
    id: 'fields.phone.required',
    defaultMessage: 'Phone number is required.',
  },
  placeholder: {
    id: 'fields.phone.placeholder',
    defaultMessage: 'Enter a Phone number',
  },
})

class Phone extends Component {
  state = {
    number: false,
    dialCode: '+1',
    defaultCountry: 'US',
    visualFieldValue: this.props.initialValue,
  }

  handleDialCodeSet = code => {
    const {
      form: { setFieldsValue },
      name,
    } = this.props
    const { visualFieldValue } = this.state
    const country = countries.find(country => country.code === code)
    this.setState(
      {
        dialCode: country.dial_code,
        countryCode: country.code,
      },
      () => {
        setFieldsValue({
          [name]: (country.dial_code + visualFieldValue).replace(/\D+/g, ''),
        })
      }
    )
  }

  handleInitialValue = () => {
    const {
      form: { setFieldsValue },
      name,
      initialValue,
    } = this.props
    const { visualFieldValue } = this.state
    console.log(this.props.initialValue)
    const dialCode = phoneUtil
      .parse(`+${this.props.initialValue}`)
      .getCountryCode()
    const country = countries.find(
      country => country.dial_code === `+${dialCode}`
    )
    this.setState(
      {
        dialCode: '+' + dialCode,
        countryCode: country.code,
      },
      () => {
        setFieldsValue({
          [name]: initialValue,
        })
      }
    )
  }

  componentDidMount() {
    this.handleInitialValue()
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialValue !== prevProps.initialValue) {
      // console.log('initial calue changed')
      // const dialCode = phoneUtil.parse(`+${this.props.initialValue}`).getCountryCode()
      // const countryCode = countries.find(country => country.dial_code === `+${dialCode}`)
      // console.log(this.props.initialValue)
    }
  }

  render() {
    const {
      form: { setFieldsValue, getFieldProps, getFieldValue, c },
      intl: { formatMessage },
      label,
      initialValue,
      name,
    } = this.props

    const {
      dialCode,
      defaultCountry,
      visualFieldValue,
      countryCode,
    } = this.state

    console.log(dialCode, initialValue)
    // const country = phoneUtil.parse('+' + initialValue).getCountryCode()
    // phoneUtil.parse('+76877987978979').getCountryCode()
    // console.log()

    const selectBefore = (
      <>
        <Select
          defaultValue={defaultCountry}
          onChange={this.handleDialCodeSet}
          style={{ width: 90, marginRight: '5px' }}
          value={countryCode}
        >
          {countries.map((country, index) => {
            if (country.code === 'AN' || country.code === 'MH') {
              return null
            }
            return (
              <Option value={country.code} key={index}>
                <Flag code={country.code} svg /> {country.code}
              </Option>
            )
          })}
        </Select>
        <b style={{ borderLeft: '1px solid #d9d9d9', paddingLeft: '8px' }}>
          {dialCode}
        </b>
      </>
    )

    const mask =
      dialCode === '+1'
        ? [
            '(',
            /[1-9]/,
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]
        : dialCode === '+44'
        ? [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        : [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    return (
      <Form.Item label={label}>
        <MaskedInput
          mask={mask}
          guide={false}
          value={initialValue}
          showMask
          render={(ref, props) => {
            const { value } = getFieldProps(name)
            return (
              <Input
                addonBefore={selectBefore}
                name={name}
                prefix={<Icon type="phone" />}
                value={visualFieldValue}
                ref={input => ref(input && input.input)}
                {...props}
                onChange={event => {
                  props.onChange(event)
                  this.setState({
                    visualFieldValue: event.target.value,
                  })
                  setFieldsValue({
                    [name]: (dialCode + event.target.value).replace(/\D+/g, ''),
                  })
                }}
              />
            )
          }}
        />
      </Form.Item>
    )
  }
}

export default compose(
  injectIntl,
  withFormContext,
  withApollo
)(Phone)
