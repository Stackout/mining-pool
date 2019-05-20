import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { compose } from 'recompose'

class Roles extends Component {
  render() {}
}

export default compose(
  injectIntl,
  withApollo
)(Roles)
