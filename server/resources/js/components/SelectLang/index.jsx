import React, { PureComponent } from 'react'
import { withLocaleConsumer } from '@locales'
import { Menu, Icon } from 'antd'
import { compose } from 'react-apollo'
import HeaderDropdown from '../HeaderDropdown'
import { css } from '@emotion/core'
import { injectIntl, defineMessages } from 'react-intl'
import styled from '@emotion/styled'

const menuStyles = css`
  margin-right: 8px;
  min-width: 160px;
`

const messages = defineMessages({
  navBarLang: {
    id: 'navBar.lang',
    defaultMessage: 'Languages',
  },
})

const DropDown = styled.div`
  display: flex;
  height: 100%;
  vertical-align: center;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
`

class SelectLang extends PureComponent {
  render() {
    const {
      locales,
      languageIcons,
      languageLabels,
      locale,
      setLocale,
      intl: { formatMessage },
    } = this.props

    const menu = (
      <Menu css={css(menuStyles)} selectedKeys={[locale]} onClick={setLocale}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <HeaderDropdown overlay={menu} placement="bottomRight">
        <DropDown>
          <Icon type="global" title={formatMessage(messages.navBarLang)} />
        </DropDown>
      </HeaderDropdown>
    )
  }
}

export default compose(
  withLocaleConsumer,
  injectIntl
)(SelectLang)
