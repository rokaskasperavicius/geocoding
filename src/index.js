import React from 'react'
import ReactDOM from 'react-dom'

import { Layout } from './Layout'
import { App } from './App'

import './main.css'

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
  document.getElementById('root')
);
