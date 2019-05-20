import React, { Component } from 'react'
import { Query } from 'react-apollo'

export const ListViewContext = React.createContext({
  page: 1,
  count: 10,
  searachTerm: undefined,
})

export class ListViewProvider extends Component {
  setPage = page => {
    this.setState({
      page,
    })
  }

  setCount = count => {
    this.setState({
      count,
    })
  }

  setPayload = payload => {
    this.setState({
      payload,
    })
  }

  setSearchTerm = searachTerm => {
    this.setState({
      searachTerm,
    })
  }

  handlePageChange = (pagination, filters, sorter) => {
    this.setState({
      count: pagination.pageSize,
      page: pagination.current,
    })
  }

  pagination = paginatorInfo => {
    const { count } = this.state
    return {
      total: paginatorInfo.total,
      pageSize: count,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '50', '100'],
    }
  }

  state = {
    page: 1,
    count: 10,
    columns: null,
    properties: null,
    searachTerm: undefined,
    setPage: this.setPage,
    setCount: this.setCount,
    setTerm: this.setTerm,
    setPayload: this.setPayload,
    handlePageChange: this.handlePageChange,
    pagination: this.pagination,

    // Handle State of Consumer's GraphQL Query
    query: this.props.query,
    resourceName: this.props.resourceName,
    payload: null,
    deleteMutation: this.props.deleteMutation,
  }

  render() {
    return (
      <ListViewContext.Provider value={this.state}>
        {this.props.children}
      </ListViewContext.Provider>
    )
  }
}

export function injectListViewContext(Component) {
  return function WrapperComponent(rest) {
    return (
      <ListViewContext.Consumer>
        {context => <Component {...context} {...rest} />}
      </ListViewContext.Consumer>
    )
  }
}

export function withListViewConsumer(Component) {
  return function WrapperComponent(rest) {
    return (
      <ListViewContext.Consumer>
        {props => {
          return (
            props.query && (
              <Query
                query={props.query}
                variables={{
                  page: props.page,
                  count: props.count,
                  term: props.searchTerm,
                }}
              >
                {payload => {
                  return <Component {...props} {...rest} {...payload} />
                }}
              </Query>
            )
          )
        }}
      </ListViewContext.Consumer>
    )
  }
}
