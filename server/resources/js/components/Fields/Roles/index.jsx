import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { allRoles } from '@graphql/Roles.graphql'
import { Form, Select } from 'antd'
import { toTitleCase } from '@helpers/utils'

const Option = Select.Option

class Roles extends Component {
  componentDidMount() {
    // TODO: Fix Memory Leak, set timeout is temporary.
    setTimeout(() => {
      this.fetchRoles()
    }, 0)
  }

  handleChange = value => {
    this.setState({
      value,
    })

    this.props.onChange && this.props.onChange(value)
  }

  fetchRoles = async () => {
    this.setLoading(true)

    const { data } = await this.props.client.query({
      query: allRoles,
      fetchPolicy: 'no-cache',
    })

    this.setLoading(false, data.allRoles)

    this.props.onRolesChange && this.props.onRolesChange(data.allRoles)
  }

  setLoading = (loading, data = []) => {
    const { onLoading } = this.props
    this.setState(
      {
        loading,
        roles: data,
      },
      () => {
        onLoading && onLoading(loading)
      }
    )
  }

  state = {
    roles: [],
    loading: false,
  }

  transformRoles = roles => {
    return roles
      ? roles.reduce((array, role) => {
          array.push(role.id)
          return array
        }, [])
      : []
  }

  render() {
    const { roles } = this.state
    const { fieldDecorator, initialValue } = this.props
    return (
      <Form.Item label="Roles">
        {fieldDecorator('roles', {
          initialValue: this.transformRoles(initialValue),
          rules: [
            {
              required: true,
              message: 'Please assign at least one role to this user.',
              type: 'array',
            },
          ],
        })(
          <Select mode="multiple" placeholder="Select a user role.">
            {roles.map(({ id, name }, index) => {
              return (
                <Option key={index} value={id}>
                  {toTitleCase(name)}
                </Option>
              )
            })}
          </Select>
        )}
      </Form.Item>
    )
  }
}

export default withApollo(Roles)
