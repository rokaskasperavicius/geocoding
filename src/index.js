import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'

import './main.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
    <footer>
      <div>
        © 2021. All Rights Reserved
      </div>
      <div>
        Created by <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/rokas-kasperavi%C4%8Dius-a70458158">Rokas Kasperavicius</a> and <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/rasgjen/">Rasmus G. Jensen</a>
      </div>
    </footer>
  </React.StrictMode>,
  document.getElementById('root')
);
