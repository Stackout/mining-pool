import React, { Component, createContext } from 'react'
import { Form, message, Button, Spin } from 'antd'
import { Mutation, Query } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { toTitleCase } from '@helpers/utils'
import { withFormProvider } from '@context/Form'

const CreateOrUpdateContext = createContext()

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
    resourceId: this.props.resourceId,
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
    const { match, form, resourceId, onRequestClose } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          isSubmitting: true,
        })
        console.log(resourceId)
        mutate({
          variables: {
            id: resourceId ? resourceId : match.params.resourceId,
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

            // Close modal if modal manager.
            onRequestClose && onRequestClose()
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
    resourceId: this.props.resourceId
      ? this.props.resourceId
      : this.props.match.params.resourceId,
    confirmDirty: false,
    autoCompleteResult: [],
    formLoading: false,
    isEditing:
      this.props.match.params.resourceId || this.props.resourceId
        ? true
        : false,
  }

  componentDidUpdate(nextProps, nextState) {
    const { match, form } = this.props
    if (match.path.includes('create') && match.path !== nextProps.match.path) {
      form.resetFields()
      this.setState({
        isEditing: false,
      })
    }
  }

  render() {
    const { form, match, disableDefaultFormSubmit, layout } = this.props
    const {
      resourceId,
      confirmDirty,
      formLoading,
      isEditing,
      isSubmitting,
    } = this.state

    const formItemLayout =
      layout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : null

    const buttonItemLayout =
      layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : null

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
                  refetchQueries={[
                    {
                      query,
                      variables: {
                        id: resourceId,
                      },
                    },
                  ]}
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
                        mutate,
                        isEditing,
                        isSubmitting,
                        loading: isFetchingResource,
                        form: form,
                        fieldDecorator: form.getFieldDecorator,
                        fetchError,
                        confirmDirty, // TODO: Deprecate
                        checkPassword: this.checkPassword, // TODO: Deprecate
                        checkConfirm: this.checkConfirm, // TODO: Deprecate
                        handleConfirmBlur: this.handleConfirmBlur,
                        handleLoadingCallback: this.handleLoadingCallback,
                        handleSubmit: this.handleSubmit,
                      })}
                      <Form.Item {...buttonItemLayout}>
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

export class FetchResource extends Component {
  render() {
    const { id, query, children } = this.props
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
  withRouter,
  withFormProvider
)(CreateOrUpdate)
