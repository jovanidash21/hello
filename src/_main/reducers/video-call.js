import {
  SOCKET_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_REQUEST_VIDEO_CALL,
  SOCKET_REJECT_VIDEO_CALL,
  SOCKET_BROADCAST_REJECT_VIDEO_CALL,
  SOCKET_ACCEPT_VIDEO_CALL,
  SOCKET_BROADCAST_ACCEPT_VIDEO_CALL
} from '../constants/video-call';
import { isObjectEmpty } from '../../utils/object';

const initialState = {
  request: false,
  reject: false,
  start: false,
  end: false,
  caller: {}
};

const videoCall = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_REQUEST_VIDEO_CALL:
      return {
        ...state,
        request: false,
        reject: false,
        start: false,
        end: false,
        caller: {}
      };
    case SOCKET_BROADCAST_REQUEST_VIDEO_CALL:
      var user =  action.user;
      var caller = {...state.caller};

      if ( isObjectEmpty(caller) ) {
        return {
          ...state,
          request: true,
          reject: false,
          start: false,
          end: false,
          caller: user
        };
      }

      return {
        ...state
      };
    case SOCKET_REJECT_VIDEO_CALL:
    case SOCKET_BROADCAST_REJECT_VIDEO_CALL:
      return {
        ...state,
        request: false,
        reject: true,
        start: false,
        end: false,
        caller: {}
      };
    case SOCKET_BROADCAST_ACCEPT_VIDEO_CALL:
      return {
        ...state
      };
    default:
      return state;
  }
}

export default videoCall;
