import axios from 'axios';
import popupTools from 'popup-tools';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { push } from 'connected-react-router';
import { sendEmail } from './email';
import {
  LOGIN,
  REGISTER,
  GUEST_LOGIN,
  SOCKET_USER_LOGIN
} from '../constants/auth';

/**
 * Socket user login
 * @param {Object} user
 */
export function socketUserLogin(user) {
  return {
    type: SOCKET_USER_LOGIN,
    user: user,
  }
}

/**
 * Local login
 * @param {string} username
 * @param {string} password
 */
export function localLogin(username, password) {
  let data = {
    username,
    password,
  };

  return dispatch => {
    dispatch(showLoading());

    return dispatch({
      type: LOGIN,
      payload: axios.post('login/local', data)
    })
    .then(() => {
      dispatch(hideLoading());
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        dispatch(hideLoading());
      }
    });
  }
}

/**
 * Facebook login
 */
export function facebookLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('login/facebook', 'Facebook Login', {}, function (err, res) {
          if (!err) {
            resolve(res);
          } else {
            reject(err);
          }
        });
      })
    })
    .then(() => {
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Google login
 */
export function googleLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('login/google', 'Google Login', {}, function (err, res) {
          if (!err) {
            resolve(res);
          } else {
            reject(err);
          }
        });
      })
    })
    .then(() => {
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Twitter login
 */
export function twitterLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('login/twitter', 'Twitter Login', {}, function (err, res) {
          if (!err) {
            resolve(res);
          } else {
            reject(err);
          }
        });
      })
    })
    .then(() => {
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Register
 * @param {string} email
 * @param {string} name
 * @param {string} username
 * @param {string} gender
 * @param {string} password
 */
export function register(email, name, username, gender, password) {
  let data = {
    email,
    name,
    username,
    gender,
    password,
  };

  return dispatch => {
    dispatch(showLoading());

    return dispatch({
      type: REGISTER,
      payload: axios.post('register', data)
    })
    .then(() => {
      dispatch(hideLoading());
      dispatch(sendEmail(email, name));
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        dispatch(hideLoading());
      }
    });
  }
}

/**
 * Guest login
 * @param {string} name
 * @param {string} username
 * @param {string} gender
 */
export function guestLogin(name, username, gender) {
  let data = {
    name,
    username,
    gender,
  };

  return dispatch => {
    dispatch(showLoading());

    return dispatch({
      type: GUEST_LOGIN,
      payload: axios.post('login/guest', data)
    })
    .then(() => {
      dispatch(hideLoading());
      dispatch(push('/chat'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        dispatch(hideLoading());
      }
    });
  }
}
