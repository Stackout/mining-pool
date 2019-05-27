import React, { Component } from 'react'
import Base from '@layout/Base'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Query, withApollo } from 'react-apollo'
import { Providers as GET_PROVIDERS } from '@graphql/Providers.graphql'
import GET_SETTING from '@graphql/Settings.graphql'
import {
  createSetting,
  updateSetting,
  deleteSetting,
  putSettings,
} from '@graphql/SettingMutations.graphql'
import { withFormProvider } from '@context/Form'
import {
  Form,
  Spin,
  Empty,
  Button,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
} from 'antd'
import { withModalConsumer, DeleteConfirmation } from '@modals'
import { compose } from 'recompose'
import ManageModal from '@modals/Manage'
import FieldBuilder from '@fields/Builder'
import ReactMarkdown from 'react-markdown'
import { transformKeyValueSettings } from '@helpers/utils'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const InputGroup = Input.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

const messages = defineMessages({
  title: {
    id: 'app.settings.title',
    defaultMessage: 'Settings',
  },
  description: {
    id: 'app.settings.description',
    defaultMessage: 'None',
  },
})

const modalMessages = defineMessages({
  title: {
    id: 'app.settings.modal.title',
    defaultMessage: 'Settings',
  },
  description: {
    id: 'app.settings.modal.description',
    defaultMessage: 'None',
  },
  encryptionHelpText: {
    id: 'app.settings.modal.encryption.documentation',
    defaultMessage:
      'When *Encrypt Value* is enabled, this specific setting value will be encrpyted by a password. The password file location is defined in the environment variables of your server, and is located by default at `/usr/local/keyfile.priv`. For more information please read the [HelixAlpha documentation](https://docs.helixalpha.dev).',
  },
})

const InputSwapper = React.forwardRef((props, ref) => {
  switch (props.type) {
    case 'tag':
      return <Select mode="tags" {...props} ref={ref} tokenSeparators={[',']} />
    case 'textarea':
      return <Input.TextArea {...props} ref={ref} />
    default:
      return <Input {...props} ref={ref} />
  }
})

const CreateOrUpdateSettingModal = ({
  onRequestClose,
  id,
  encryptionHelpText,
}) => {
  return (
    <ManageModal
      onRequestClose={onRequestClose}
      messages={modalMessages}
      queries={{
        view: GET_SETTING,
      }}
      mutations={{
        create: createSetting,
        update: updateSetting,
      }}
      resourceId={id}
      resourceName={'setting'}
    >
      {({ form: { getFieldDecorator }, loading, resource, isEditing }) => {
        return (
          <>
            <Form.Item
              validateStatus="warning"
              label="Setting Key"
              help="Warning: Changing the key can produce undesireable results."
            >
              {getFieldDecorator('key', {
                initialValue: isEditing && !loading ? resource.setting.key : '',
                rules: [
                  {
                    required: true,
                    message: 'Please input a key!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator('description', {
                initialValue:
                  isEditing && !loading ? resource.setting.description : '',
                rules: [
                  {
                    required: true,
                    message: 'Please input a description!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <FieldBuilder
              value={isEditing && !loading ? resource.setting.field : '[]'}
              name="field"
            />
            <Form.Item
              label="Additional Settings"
              help={<ReactMarkdown source={encryptionHelpText} />}
            >
              <Row>
                <Col span={8}>
                  {getFieldDecorator('is_encrypted', {
                    initialValue:
                      isEditing && !loading
                        ? resource.setting.is_encrypted
                        : false,
                  })(<Checkbox>Encrypt Value</Checkbox>)}
                </Col>
                <Col span={8}>
                  {getFieldDecorator('active', {
                    initialValue:
                      isEditing && !loading ? resource.setting.active : true,
                    valuePropName: 'checked',
                  })(<Checkbox>Active</Checkbox>)}
                </Col>
              </Row>
            </Form.Item>
          </>
        )
      }}
    </ManageModal>
  )
}

class GeneralSettings extends Component {
  handleSubmit = event => {
    event.preventDefault()
    const { form, client } = this.props

    this.setState({
      isSubmitting: true,
    })

    form.validateFields((error, entries) => {
      if (!error) {
        client
          .mutate({
            mutation: putSettings,
            variables: {
              data: transformKeyValueSettings(entries),
            },
          })
          .then(response => {
            this.setState({
              isSubmitting: false,
            })
          })
          .catch(error => {
            console.error('Internal Server Error.', error)
            this.setState({
              isSubmitting: false,
            })
          })
      } else {
        this.setState({
          isSubmitting: false,
        })
      }
    })
  }

  render() {
    const {
      showModal,
      form: { getFieldDecorator },
      intl: { formatMessage },
    } = this.props

    return (
      <Query
        query={GET_PROVIDERS}
        variables={{
          keys: ['main_app'],
        }}
      >
        {({ data, loading, error, refetch: refetchListView }) => (
          <Form>
            {(() => {
              console.log(data)
            })()}
            <Base messages={messages}>
              <Spin spinning={loading}>
                {loading || (data && data.providers.length === 0) ? (
                  <Empty
                    image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                    imageStyle={{
                      height: 60,
                    }}
                    description={
                      <span>There are no application settings to view.</span>
                    }
                  >
                    <Button type="primary" icon="form">
                      Create
                    </Button>
                  </Empty>
                ) : (
                  <>
                    {data.providers[0].settings.map((setting, index) => {
                      const { name, label, type, placeholder } = JSON.parse(
                        setting.field
                      )

                      const value =
                        type === 'tag'
                          ? setting.value.split(',')
                          : setting.value
                      return (
                        <FormItem
                          help={setting.description}
                          label={label}
                          key={setting.key}
                        >
                          <InputGroup>
                            {getFieldDecorator(setting.key, {
                              initialValue: value,
                              rules: [],
                            })(
                              <InputSwapper
                                type={type}
                                style={{ width: '80%' }}
                                placeholder={placeholder}
                              />
                            )}
                            <ButtonGroup>
                              <Button
                                icon="form"
                                type="primary"
                                style={{
                                  borderLeft: '1px',
                                  borderRadius: '0px',
                                }}
                                onClick={event =>
                                  showModal(CreateOrUpdateSettingModal, {
                                    id: setting.id,
                                    encryptionHelpText: formatMessage(
                                      modalMessages.encryptionHelpText
                                    ),
                                  })
                                }
                              />
                              <Button
                                icon="delete"
                                type="danger"
                                onClick={() => {
                                  showModal(DeleteConfirmation, {
                                    resource: { ...setting, name: setting.key },
                                    deleteMutation: deleteSetting,
                                    refetchListView,
                                  })
                                }}
                              />
                            </ButtonGroup>
                          </InputGroup>
                        </FormItem>
                      )
                    })}
                  </>
                )}
                <FormItem>
                  <Button
                    type="dashed"
                    icon="plus"
                    block
                    style={{ width: '80%', marginTop: '25px' }}
                    onClick={event => {
                      showModal(CreateOrUpdateSettingModal)
                    }}
                  >
                    Add Setting
                  </Button>
                </FormItem>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    htmlType="submit"
                  >
                    Save Settings
                  </Button>
                </Form.Item>
              </Spin>
            </Base>
          </Form>
        )}
      </Query>
    )
  }
}

export default compose(
  withModalConsumer,
  withFormProvider,
  withApollo,
  injectIntl
)(GeneralSettings)
