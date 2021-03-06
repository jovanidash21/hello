import axios from 'axios';
import {
  FETCH_ACTIVE_USER,
  EDIT_ACTIVE_USER,
  SOCKET_EDIT_ACTIVE_USER,
  SEARCH_USER,
} from '../constants/user';
import { fetchChatRooms } from './chat-room';

/**
 * Fetch user
 */
export function fetchActiveUser() {
  return dispatch => {
    return dispatch({
      type: FETCH_ACTIVE_USER,
      payload: axios.get('/user')
    })
    .then((response) => {
      dispatch(fetchChatRooms(response.value.data.user._id));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Edit active user
 * @param {string} userID
 * @param {string} username
 * @param {string} name
 * @param {string} email
 * @param {string} gender
 * @param {string} profilePicture
 */
export function editActiveUser(userID, username, name, email, gender, profilePicture) {
  let data = {
    userID,
    username,
    name,
    email,
    gender,
    profilePicture
  };

  return dispatch => {
    return dispatch({
      type: EDIT_ACTIVE_USER,
      payload: axios.post('/user/edit-profile', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_EDIT_ACTIVE_USER,
        user: response.action.payload.data.user,
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Search user
 *
 * @param {string} query
 * @param {string} chatRoomID
 */
export function searchUser(query, chatRoomID = '') {
  let data = {
    query,
    chatRoomID,
  };

  return dispatch => {
    return dispatch({
      type: SEARCH_USER,
      payload: axios.post('/user/search', data)
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
