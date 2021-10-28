import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

// Components
import { Layout } from 'components'

// Pages
import { Map, Attributions } from 'pages'

// Styles
import 'styles/main.css'

ReactDOM.render(
  <Router>
    <Switch>
      <Route path='/attributions'>
        <Layout>
          <Attributions />
        </Layout>
      </Route>
      <Route path='*'>
        <Layout>
          <Map />
        </Layout>
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
