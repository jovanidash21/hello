import axios from 'axios';
import {
  START_LIVE_VIDEO,
  SOCKET_START_LIVE_VIDEO,
  END_LIVE_VIDEO,
  SOCKET_END_LIVE_VIDEO
} from '../constants/live-video';
import { getBaseURL } from '../../utils/url';

const baseURL = getBaseURL();

/**
 * Start live video
 * @param {string} userID
 * @param {string} chatRoomID
 */
export function startLiveVideo(userID, chatRoomID) {
  let data = {
    userID: userID,
    start: true
  };

  return dispatch => {
    return dispatch({
      type: START_LIVE_VIDEO,
      payload: axios.post(baseURL + '/api/live-video', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_START_LIVE_VIDEO,
        userID: userID,
        chatRoomID: chatRoomID
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
 * End live video
 * @param {string} userID
 * @param {string} chatRoomID
 */
export function endLiveVideo(userID, chatRoomID) {
  let data = {
    userID: userID,
    start: false
  };

  return dispatch => {
    return dispatch({
      type: END_LIVE_VIDEO,
      payload: axios.post(baseURL + '/api/live-video', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_END_LIVE_VIDEO,
        userID: userID,
        chatRoomID: chatRoomID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
