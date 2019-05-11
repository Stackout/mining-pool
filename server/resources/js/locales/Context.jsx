import React, { Component, createContext } from 'react'
import translations from './index'
import { LocaleProvider as AntDLocaleProvider } from 'antd'

/**
 * Define Context for Modals
 */
export const LocaleContext = createContext({
  locale: 'en_US',
  messages: {},
  setLocale: () => {},
})

export const LocaleConsumer = LocaleContext.Consumer

const locales = ['en_US', 'de_DE', 'fa_IR']

const languageIcons = {
  en_US: '🇬🇧',
  de_DE: '🇩🇪',
  fa_IR: '🇮🇷',
}

const languageLabels = {
  en_US: 'English',
  de_DE: 'Deutsch',
  fa_IR: 'فارسی',
}

export class LocaleProvider extends Component {
  transformLocaleToLang = locale => {
    return locale.split('_')[0]
  }

  setLocale = locale => {
    const { key } = locale
    this.setState({
      locale: key,
      language: this.transformLocaleToLang(key),
      messages: translations[key],
    })
    console.log(this.state)
  }

  state = {
    locale: 'en_US',
    language: 'en',
    setLocale: this.setLocale,
    transformLocaleToLang: this.transformLocaleToLang,
    messages: translations.en_US,
    translations,
    locales,
    languageLabels,
    languageIcons,
  }

  render() {
    return (
      <AntDLocaleProvider locale={{ locale: this.state.locale }}>
        <LocaleContext.Provider value={this.state}>
          {this.props.children}
        </LocaleContext.Provider>
      </AntDLocaleProvider>
    )
  }
}

export const withLocaleConsumer = WrappedComponent => {
  class HOC extends Component {
    render() {
      const rest = this.props
      return (
        <LocaleConsumer>
          {props => <WrappedComponent {...props} {...rest} />}
        </LocaleConsumer>
      )
    }
  }

  return HOC
}
