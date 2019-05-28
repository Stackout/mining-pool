export { default as QuickStartModal } from './QuickStart'
export { default as ProductDocModal } from './ProductDoc'
export { default as ProductInfoModal } from './ProductInfo'
export { default as DeleteConfirmation } from './DeleteConfirmation'
export { default as ChangePassword } from './ChangePassword'
export { default as ChangeSecurityPhone } from './Account/ChangeSecurityPhone'

export {
  ModalRoot,
  ModalContext,
  ModalProvider,
  ModalConsumer,
  withModalProvider,
  withModalConsumer,
  injectModalConsumer,
} from './Context'
