import React, { Fragment } from 'react';
import { Switch } from 'react-router';
import LoadingBar from 'react-redux-loading-bar';
import Popup from 'react-popup';
import AuthForm from '../containers/AuthForm';
import Layout from '../containers/Layout';
import { Login } from '../containers/Login';
import { Register } from '../containers/Register';
import { Guest } from '../containers/Guest';
import { Chat } from '../containers/Chat';
import 'react-popup/style.css';
import '../../styles/Common.scss';
import '../styles/Common.scss';

const routes = (
  <Fragment>
    <LoadingBar className="loading-bar" />
    <Popup />
    <Switch>
      <AuthForm exact path="/" component={Login} title="Login" />
      <AuthForm exact path="/register" component={Register} title="Register" />
      <AuthForm exact path="/guest" component={Guest} title="Guest" />
      <Layout exact path="/chat" component={Chat} />
    </Switch>
  </Fragment>
);

export default routes;
