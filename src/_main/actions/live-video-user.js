import axios from 'axios';
import {
  START_LIVE_VIDEO,
  SOCKET_START_LIVE_VIDEO,
  SOCKET_REQUEST_LIVE_VIDEO,
  SOCKET_ACCEPT_LIVE_VIDEO,
  SET_LIVE_VIDEO_SOURCE,
  END_LIVE_VIDEO,
  SOCKET_END_LIVE_VIDEO
} from '../constants/live-video-user';
import { getBaseURL } from '../../utils/url';

const baseURL = getBaseURL();
const extraUserData = {
  video: {
    loading: false,
    source: {}
  }
};

/**
 * Start live video
 * @param {object} user
 * @param {string} chatRoomID
 */
export function startLiveVideo(user, chatRoomID) {
  let data = {
    userID: user._id,
    start: true
  };

  return dispatch => {
    return dispatch({
      type: START_LIVE_VIDEO,
      payload: axios.post(baseURL + '/api/live-video', data),
      meta: {
        ...user,
        ...extraUserData
      }
    })
    .then((response) => {
      dispatch({
        type: SOCKET_START_LIVE_VIDEO,
        userID: user._id,
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
 * Request live video
 * @param {string} viewerID
 * @param {object} liveVideoUser
 * @param {object} peerID
 */
export function requestLiveVideo(viewerID, liveVideoUser, peerID) {
  return {
    type: SOCKET_REQUEST_LIVE_VIDEO,
    viewerID: viewerID,
    user: {
      ...liveVideoUser,
      ...extraUserData
    },
    userID: liveVideoUser._id,
    peerID: peerID
  };
}

/**
 * Set live video source
 * @param {string} userID
 * @param {object} source
 */
export function setLiveVideoSource(userID, source) {
  return {
    type: SET_LIVE_VIDEO_SOURCE,
    userID: userID,
    source: source
  };
}

export function acceptLiveVideo(viewerID, peerID) {
  return {
    type: SOCKET_ACCEPT_LIVE_VIDEO,
    viewerID: viewerID,
    peerID: peerID
  };
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
      payload: axios.post(baseURL + '/api/live-video', data),
      meta: userID
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
