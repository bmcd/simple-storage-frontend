import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './app/store'
import CssBaseline from '@material-ui/core/CssBaseline'

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/bmcd/simplestoragev1',
})

function render (TheApp) {
  ReactDOM.render(
    <React.Fragment>
      <CssBaseline/>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <TheApp/>
        </ApolloProvider>
      </Provider>
    </React.Fragment>,
    document.getElementById('root'),
  )
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}
render(App)
