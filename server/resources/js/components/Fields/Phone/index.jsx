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
const PNF = libphonenumber.PhoneNumberFormat

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
  invalidPhoneNumber: {
    id: 'fields.phone.invalid',
    defaultMessage: 'Enter a valid phone number.',
  },
})

class Phone extends Component {
  state = {
    number: false,
    dialCode: '+1',
    countryCode: "US",
    value: this.props.initialValue,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      const {
        name,
        initialValue,
        form: { setFieldsValue },
      } = this.props
      const { formattedNumber } = this.parsePhoneNumber(initialValue)
      setFieldsValue({
        [name]: formattedNumber,
      })
    }
  }

  componentDidMount() {
    const {
      name,
      initialValue,
      form: { setFieldsValue },
    } = this.props
    const { formattedNumber } = this.parsePhoneNumber(initialValue)
    setFieldsValue({
      [name]: formattedNumber,
    })
  }

  parsePhoneNumber = number => {
    if (number) {
      const phoneNumber = phoneUtil.parse(number, '')
      if (phoneUtil.isPossibleNumber(phoneNumber)) {
        const parsedNumber = {
          dialCode: '+' + phoneNumber.getCountryCode(),
          value: phoneNumber.getNationalNumber(),
          countryCode: phoneUtil.getRegionCodeForNumber(phoneNumber),
          formattedNumber: phoneUtil.format(phoneNumber, PNF.E164),
        }
        this.setState({
          ...parsedNumber,
        })
        return parsedNumber
      }
    }

    return {}
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

  setField = value => {
    const {
      form: { setFieldsValue, setFields },
      name,
      intl: { formatMessage },
    } = this.props
    const { dialCode, countryCode } = this.state

    this.setState({
      value: value,
    })

    const number = dialCode + value
    if (value === '') {
      return
    }
    try {
      const phoneNumber = phoneUtil.parse(number, countryCode)
      if (phoneUtil.isPossibleNumber(phoneNumber)) {
        setFieldsValue({
          [name]: phoneUtil.format(phoneNumber, PNF.E164),
        })
      }
    } catch (error) {
      setFields({
        [name]: {
          value: number,
          errors: [new Error(formatMessage(messages.invalidPhoneNumber))],
        },
      })
    }
  }

  render() {
    const {
      form: { getFieldProps, getFieldValue, getFieldError },
      intl: { formatMessage },
      label,
      initialValue,
      name,
    } = this.props

    const { dialCode, defaultCountry, value, countryCode } = this.state

    const errors = getFieldError(name)

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
                <Flag code={country.code} /> {country.code}
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
      <Form.Item
        label={label}
        validateStatus={errors && 'error'}
        help={errors && errors}
      >
        <MaskedInput
          mask={mask}
          guide={false}
          defaultValue={initialValue}
          showMask
          render={(ref, props) => {
            return (
              <Input
                {...getFieldProps(name)}
                addonBefore={selectBefore}
                name={name}
                prefix={<Icon type="phone" />}
                value={value}
                ref={input => ref(input && input.input)}
                {...props}
                onChange={event => {
                  props.onChange(event)
                  this.setField(event.target.value)
                }}
                placeholder={formatMessage(messages.placeholder)}
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

// console.log(dialCode, initialValue)
// // const country = phoneUtil.parse('+' + initialValue).getCountryCode()
// // phoneUtil.parse('+76877987978979').getCountryCode()
// // console.log()
// componentDidMount() {
//   this.handleInitialValue()
// }

// componentDidUpdate(prevProps) {
//   if (this.props.initialValue !== prevProps.initialValue) {
//     // console.log('initial calue changed')
//     // const dialCode = phoneUtil.parse(`+${this.props.initialValue}`).getCountryCode()
//     // const countryCode = countries.find(country => country.dial_code === `+${dialCode}`)
//     // console.log(this.props.initialValue)
//   }
// // }

// handleInitialValue = () => {
//   const {
//     form: { setFieldsValue },
//     name,
//     initialValue,
//   } = this.props
//   const { value } = this.state
//   console.log(this.props.initialValue)
//   const dialCode = phoneUtil
//     .parse(`+${this.props.initialValue}`)
//     .getCountryCode()
//   const country = countries.find(
//     country => country.dial_code === `+${dialCode}`
//   )
//   this.setState(
//     {
//       dialCode: '+' + dialCode,
//       countryCode: country.code,
//     },
//     () => {
//       setFieldsValue({
//         [name]: initialValue,
//       })
//     }
//   )
// }
