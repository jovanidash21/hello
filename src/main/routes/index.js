import React from 'react';
import { Switch } from 'react-router';
import LoadingBar from 'react-redux-loading-bar';
import Popup from 'react-popup';
import AuthForm from '../containers/AuthForm';
import Layout from '../containers/Layout';
import Login from '../containers/Login';
import Register from '../containers/Register';
import Guest from '../containers/Guest';
import Chat from '../containers/Chat';
import Admin from '../containers/Admin';
import 'react-popup/style.css';
import '../styles/Common.scss';

const routes = (
  <div>
    <LoadingBar className="loading-bar" />
    <Popup />
    <Switch>
      <AuthForm exact path="/" component={Login} />
      <AuthForm exact path="/register" component={Register} />
      <AuthForm exact path="/guest" component={Guest} />
      <Layout exact path="/chat" component={Chat} />
      <Layout exact path="/admin" component={Admin} />
    </Switch>
  </div>
);

export default routes;
