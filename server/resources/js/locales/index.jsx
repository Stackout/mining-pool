import { addLocaleData } from 'react-intl'

import en_US from './translations/en_US.json'
import de_DE from './translations/de_DE.json'
import fa_IR from './translations/fa_IR.json'

import enLocaleData from 'react-intl/locale-data/en'
import deLocaleData from 'react-intl/locale-data/de'
import faLocaleData from 'react-intl/locale-data/fa'

export const localeData = [enLocaleData, deLocaleData, faLocaleData]

export const addAppLocaleData = () =>
  localeData.forEach(locale => addLocaleData(locale))

export { LocaleProvider, LocaleConsumer, withLocaleConsumer } from './Context'

export default { en_US, de_DE, fa_IR }
