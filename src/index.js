import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Register from './components/Register';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div>
        <Route exact path='/' component={App} />
        <Route path='/register' component={Register} />
        <Route path='/edit/:version' component={Register} />
      </div>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
