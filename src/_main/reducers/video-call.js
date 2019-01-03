import {
  SOCKET_BROADCAST_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_REJECT_VIDEO_CALL,
  SOCKET_BROADCAST_ACCEPT_VIDEO_CALL
} from '../constants/video-call';
import { isObjectEmpty } from '../../utils/object';

const initialState = {
  caller: {}
};

const videoCall = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_BROADCAST_REQUEST_VIDEO_CALL:
      var caller = action.caller;

      if ( isObjectEmpty ) {
        return {
          ...state,
          caller: caller
        };
      }

      return {
        ...state
      };
    case SOCKET_BROADCAST_REJECT_VIDEO_CALL:
      return {
        ...state,
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
