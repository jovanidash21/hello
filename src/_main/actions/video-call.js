import {
  SOCKET_REQUEST_VIDEO_CALL,
  SOCKET_REJECT_VIDEO_CALL,
  SOCKET_ACCEPT_VIDEO_CALL
} from '../constants/video-call';

/**
 * Request video call
 * @param {string} callerID
 * @param {string} receiverID
 */
export function requestVideoCall(callerID, receiverID) {
  return {
    type: SOCKET_REQUEST_VIDEO_CALL,
    callerID: callerID,
    receiverID: receiverID
  };
}

/**
 * Reject video call
 * @param {string} callerID
 * @param {string} receiverID
 */
export function rejectVideoCall(callerID) {
  return {
    type: SOCKET_REJECT_VIDEO_CALL,
    callerID: callerID
  };
}

/**
 * Accept video call
 * @param {string} callerID
 * @param {string} receiverID
 */
export function acceptVideoCall(callerID, receiverID) {
  return {
    type: SOCKET_ACCEPT_VIDEO_CALL,
    callerID: callerID,
    receiverID: receiverID
  };
}
