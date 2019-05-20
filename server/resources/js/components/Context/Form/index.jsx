import React, { Component, createContext } from 'react'
import { Form } from 'antd'
import { compose } from 'recompose'

const FormContext = createContext({
  formItemLayout,
  tailFormItemLayout,
  form: {},
  handleConfirmBlur: () => {},
})

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

class FormContextProvider extends Component {
  handleConfirmBlur = event => {
    const value = event.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  state = {
    confirmDirty: false,
    form: this.props.form,
    formItemLayout,
    tailFormItemLayout,
    handleConfirmBlur: this.handleConfirmBlur,
  }

  render() {
    return (
      <FormContext.Provider value={this.state}>
        {this.props.children}
      </FormContext.Provider>
    )
  }
}

export const FormConsumer = ({ children }) => {
  return (
    <FormContext.Consumer>
      {form => {
        if (!form) {
          throw new Error('Missing FormProvider in its parent.')
        }
        return children(form)
      }}
    </FormContext.Consumer>
  )
}

export function withFormContext(Component) {
  return function WrapperComponent(rest) {
    return (
      <FormConsumer>{props => <Component {...props} {...rest} />}</FormConsumer>
    )
  }
}

export function withFormProvider(Component) {
  function WrapperComponent(rest) {
    return (
      <FormContextProvider form={rest.form}>
        <Component {...rest} />
      </FormContextProvider>
    )
  }

  return Form.create()(WrapperComponent)
}

export default compose(Form.create())(FormContextProvider)
