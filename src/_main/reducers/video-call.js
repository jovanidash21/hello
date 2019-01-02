import {
  SOCKET_BROADCAST_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_REJECT_VIDEO_CALL,
  SOCKET_BROADCAST_ACCEPT_VIDEO_CALL
} from '../constants/video-call';

const initialState = {

};

const videoCall = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_BROADCAST_REQUEST_VIDEO_CALL:
      return {
        ...state
      };
    case SOCKET_BROADCAST_REJECT_VIDEO_CALL:
      return {
        ...state
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
