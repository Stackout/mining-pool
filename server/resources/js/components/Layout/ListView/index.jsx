import React, { Component } from 'react'

export const ListViewContext = React.createContext({
  page: 1,
  count: 10,
  searachTerm: undefined
})

export const ListViewConsumer = ListViewContext.Consumer

export class ListViewProvider extends Component {

  setPage = (page) => {
    this.setState({
      page
    })
  }

  setCount = (count) => {
    this.setState({
      count
    })
  }

  setPayload = (payload) => {
    this.setState({
      payload
    })
  }

  setSearchTerm = (searachTerm) => {
    this.setState({
      searachTerm
    })
  }

  state = {
    page: 1,
    count: 10,
    searachTerm: undefined,
    query: null,
    payload: null,
    setPage: this.setPage,
    setCount: this.setCount,
    setTerm: this.setTerm,
    setPayload: this.setPayload,
  }

  componentDidMount(){
    const { query } = this.props
    this.setState({
      query
    })
  }

  render() {
    return(
      <ListViewContext.Provider value={this.state}>
        {children}
      </ListViewContext.Provider>
    )
  }

}