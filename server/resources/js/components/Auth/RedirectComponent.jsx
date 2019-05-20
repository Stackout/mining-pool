import React from 'react'
import { Redirect } from 'react-router-dom'

export default class RedirectComponent extends React.Component {
  render() {
    return <Redirect to="/login" />
  }
}
