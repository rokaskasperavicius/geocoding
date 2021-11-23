import React from 'react'
import ReactDOM from 'react-dom'

// Components
import { Layout } from 'components'

// Pages
import { Map } from 'pages'

// Styles
import 'styles/main.css'

ReactDOM.render(
  <Layout>
    <Map />
  </Layout>,
  document.getElementById('root')
);
