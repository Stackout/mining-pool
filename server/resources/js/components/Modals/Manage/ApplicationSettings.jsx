import React from 'react'
import { Provider as GET_PROVIDER } from '@graphql/Providers.graphql'
import { compose } from 'recompose'
import { injectIntl, defineMessages } from 'react-intl'
import { Input, Form, Empty } from 'antd'
import ManageModal from './index'
import { createProvider } from '@graphql/ProviderMutations.graphql'
import { putSettings } from '@graphql/SettingMutations.graphql'
import ReactMarkdown from 'react-markdown'

const messages = defineMessages({
  title: {
    id: 'app.modals.manage.application-settings.title',
    defaultMessage: 'Application Settings',
  },
  description: {
    id: 'app.modals.manage.application-settings.description',
    defaultMessage: 'Application setting description.',
  },
})

const InputSwap = React.forwardRef((props, ref) => {
  switch (props.type) {
    case 'password':
      return <Input.Password {...props} ref={ref} />
    default:
      return <Input {...props} ref={ref} />
  }
})

const ManageProviderModal = ({ onRequestClose, id }) => {
  return (
    <ManageModal
      onRequestClose={onRequestClose}
      messages={messages}
      queries={{
        view: GET_PROVIDER,
      }}
      mutations={{
        create: createProvider,
        update: putSettings,
      }}
      resourceId={id}
      resourceName={'provider'}
      onRequestClose={onRequestClose}
    >
      {({
        form: {
          getFieldDecorator,
          setFieldsValue,
          getFieldProps,
          getFieldValue,
        },
        loading,
        resource,
        isEditing,
      }) => (
        <>
          {!loading && resource && resource.provider ? (
            resource.provider.settings.map((setting, index) => {
              const field = JSON.parse(setting.field)
              const { value, ref } = getFieldProps(`${index}`)
              return (
                <Form.Item
                  help={<ReactMarkdown source={setting.description} />}
                  label={field.label}
                  key={setting.key}
                >
                  <InputSwap
                    value={
                      value && (value.value === '' || value.value)
                        ? value.value
                        : setting.value
                    }
                    type={field.type}
                    name={field.name}
                    ref={ref}
                    onChange={event => {
                      setFieldsValue({
                        [index]: {
                          key: setting.key,
                          value: event.target.value,
                        },
                      })
                    }}
                  />
                </Form.Item>
              )
            })
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </ManageModal>
  )
}

export default compose(injectIntl)(ManageProviderModal)
