import React, { Component, createContext } from 'react'
import { Form, message, Input, Button, Spin } from 'antd'
import { Mutation, Query } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { toTitleCase } from '@helpers/utils'
import styled from '@emotion/styled'

const CreateOrUpdateContext = createContext()

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

export class CreateOrUpdateProvider extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    resourceId: null,
    resourceName: this.props.resourceName,
    mutations: this.props.mutations,
    query: this.props.query,
  }

  render() {
    return (
      <CreateOrUpdateContext.Provider value={this.state}>
        {this.props.children}
      </CreateOrUpdateContext.Provider>
    )
  }
}

export class CreateOrUpdate extends Component {
  handleSubmit = (event, mutate, successMessage) => {
    event.preventDefault()
    const { match, form } = this.props

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          isSubmitting: true,
        })

        mutate({
          variables: {
            id: match.params.resourceId,
            data: values,
          },
        })
          .then(response => {
            console.log(response)
            message.success(successMessage)
            form.resetFields()
            this.setState({
              isSubmitting: false,
            })
          })
          .catch(error => {
            this.setState({
              isSubmitting: false,
            })
          })
      }
    })
  }

  handleConfirmBlur = event => {
    const value = event.target.value
    const { confirmDirty } = this.state
    this.setState({ confirmDirty: confirmDirty || !!value })
  }

  handleLoadingCallback = loading => {
    this.setState({
      formLoading: loading,
    })
  }

  state = {
    resourceId: this.props.match.params.resourceId,
    confirmDirty: false,
    autoCompleteResult: [],
    formLoading: false,
    isEditing: this.props.match.params.resourceId ? true : false,
  }

  componentDidUpdate(nextProps, nextState) {
    const { match, form } = this.props
    if (match.path.includes('create') && match.path !== nextProps.match.path) {
      form.resetFields()
      this.setState({
        isEditing: false,
      })
      console.log('Setting editing to false')
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      match,
    } = this.props
    const {
      resourceId,
      confirmDirty,
      formLoading,
      isEditing,
      isSubmitting,
    } = this.state
    return (
      <CreateOrUpdateContext.Consumer>
        {({ mutations, query, resourceName }) => (
          <FetchResource id={resourceId} query={query} mutations={mutations}>
            {({
              loading: isFetchingResource,
              error: fetchError,
              data: resource,
            }) => (
              <Spin spinning={isEditing && (formLoading || isFetchingResource)}>
                <Mutation
                  mutation={isEditing ? mutations.update : mutations.create}
                >
                  {(mutate, { data }) => (
                    <Form
                      {...formItemLayout}
                      onSubmit={event => {
                        this.handleSubmit(
                          event,
                          mutate,
                          `${toTitleCase(resourceName)} has been successfully ${
                            resourceId ? `updated` : `created`
                          }.`
                        )
                      }}
                    >
                      {this.props.children({
                        resource,
                        match,
                        isEditing,
                        loading: isFetchingResource,
                        fetchError,
                        fieldDecorator: getFieldDecorator,
                        tailFormItemLayout,
                        formItemLayout,
                        confirmDirty,
                        checkPassword: this.checkPassword,
                        checkConfirm: this.checkConfirm,
                        handleConfirmBlur: this.handleConfirmBlur,
                        handleLoadingCallback: this.handleLoadingCallback,
                      })}
                      <Form.Item {...tailFormItemLayout}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isSubmitting}
                        >
                          {isEditing ? `Update` : `Create`}
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Mutation>
              </Spin>
            )}
          </FetchResource>
        )}
      </CreateOrUpdateContext.Consumer>
    )
  }
}

class FetchResource extends Component {
  render() {
    const { id, query, children, mutations } = this.props
    if (!id) {
      const data = { data: { data: {} }, loading: {}, error: {} }
      return <div>{children(data)}</div>
    }

    return (
      <Query
        query={query}
        variables={{
          id,
        }}
      >
        {data => <>{children(data)}</>}
      </Query>
    )
  }
}

export default compose(
  Form.create({ name: 'resource' }),
  withRouter
)(CreateOrUpdate)
