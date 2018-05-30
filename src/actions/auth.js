import axios from 'axios';
import popupTools from 'popup-tools';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { push } from 'react-router-redux';
import { sendEmail } from './email';
import {
  LOGIN,
  REGISTER,
  GUEST_LOGIN,
  LOGOUT,
  SOCKET_USER_LOGIN,
  SOCKET_USER_LOGOUT
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
      payload: axios.post('/api/login/local', data)
    })
    .then((response) => {
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
        popupTools.popup('/api/login/facebook', 'Facebook Login', {}, function (err, res) {
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
        popupTools.popup('/api/login/google', 'Google Login', {}, function (err, res) {
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
        popupTools.popup('/api/login/twitter', 'Twitter Login', {}, function (err, res) {
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
 * Instagram login
 */
export function instagramLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('/api/login/instagram', 'Instagram Login', {}, function (err, res) {
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
 * LinkedIn login
 */
export function linkedinLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('/api/login/linkedin', 'LinkedIn Login', {}, function (err, res) {
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
 * GitHub login
 */
export function githubLogin() {
  return dispatch => {
    return dispatch({
      type: LOGIN,
      payload: new Promise((resolve, reject) => {
        popupTools.popup('/api/login/github', 'GitHub Login', {}, function (err, res) {
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
      payload: axios.post('/api/register', data)
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
      payload: axios.post('/api/login/guest', data)
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
 * Logout
 * @param {string} userID
 */
export function logout(userID) {
  return dispatch => {
    dispatch(showLoading());

    return dispatch({
      type: LOGOUT,
      payload: axios.post('/api/logout')
    })
    .then(() => {
      dispatch({
        type: SOCKET_USER_LOGOUT,
        user: userID,
      });
      dispatch(hideLoading());
      dispatch(push('/'));
    })
    .catch((error) => {
      if (error instanceof Error) {
        dispatch(hideLoading());
      }
    });
  }
}
