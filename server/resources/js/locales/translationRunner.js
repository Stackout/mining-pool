const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  messagesDirectory: 'resources/js/locales/messages',
  translationsDirectory: 'resources/js/locales/translations/',
  languages: ['en_US', 'de_DE', 'fa_IR'], // any language you need
})
