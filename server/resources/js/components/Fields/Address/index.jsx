import React, { Component } from 'react'
import countries from '@helpers/locale/countries.json'
import provinces from '@helpers/locale/provinces.json'
import { Select, Form, Input } from 'antd'
import { compose } from 'recompose'
import { withFormContext } from '@context/Form'
import styled from '@emotion/styled'

const Option = Select.Option

class Countries extends Component {
  handleChange = value => {
    console.log(value)
    this.setProvinces(value)
  }

  setProvinces = country => {
    const { form } = this.props
    this.setState(
      {
        provinceList: country ? provinces[0][country] : null,
      },
      () => {
        form.setFieldsValue({
          province: provinces[0][country]
            ? provinces[0][country][0].name
            : undefined,
        })
      }
    )
  }

  state = {
    provinceList: provinces[0]['US'],
  }

  render() {
    const { form, index, name } = this.props
    const { provinceList } = this.state

    const hasProvince = provinceList && provinceList.length > 0

    let country = 'country'
    let addressLine1 = 'street_1'
    let addressLine2 = 'street_2'
    let city = 'city'
    let state = 'state'
    let postalCode = 'postal_code'

    country = `${name}.${country}`
    addressLine1 = `${name}.${addressLine1}`
    addressLine2 = `${name}.${addressLine2}`
    city = `${name}.${city}`
    state = `${name}.${state}`
    postalCode = `${name}.${postalCode}`

    return (
      <>
        <Form.Item label="Country / Region">
          {form.getFieldDecorator(country, {
            initialValue: 'US',
          })(
            <Select
              showSearch
              allowClear
              placeholder="Select a State or Province"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.handleChange}
            >
              {countries.map((country, index) => {
                return (
                  <Option key={index} value={country.code}>
                    {country.name}
                  </Option>
                )
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Address Line 1">
          {form.getFieldDecorator(addressLine1)(<Input />)}
        </Form.Item>
        <Form.Item label="Address Line 2">
          {form.getFieldDecorator(addressLine2)(<Input />)}
        </Form.Item>
        <Form.Item>
          <Form.Item
            label="City"
            style={{
              display: 'inline-block',
              width: 'calc(50% - 12px)',
            }}
          >
            {form.getFieldDecorator(city)(<Input />)}
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              textAlign: 'center',
            }}
          />
          {hasProvince && (
            <>
              <Form.Item
                label="State / Province"
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                {form.getFieldDecorator(state)(
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select a State or Province"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete="off"
                  >
                    {provinceList.map((province, index) => (
                      <Option value={province.name} key={index}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Postal Code"
            style={{
              display: 'inline-block',
              width: 'calc(50% - 12px)',
            }}
          >
            {form.getFieldDecorator(postalCode)(<Input />)}
          </Form.Item>
        </Form.Item>
      </>
    )
  }
}

export default compose(withFormContext)(Countries)
