import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { ConnectedRouter } from 'connected-react-router';
import store from './store';
import history from '../history';
import routes from './routes';

axios.defaults.baseURL = process.env.API_URL;

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root'));
