import {
  SOCKET_BROADCAST_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_ACCEPT_VIDEO_CALL
} from '../constants/video-call';
import { isObjectEmpty } from '../../utils/object';

const initialState = {
  active: false,
  peerUser: {}
};

const videoCall = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_BROADCAST_REQUEST_VIDEO_CALL:
      var user =  action.user;
      var peerUser = {...state.peerUser};

      if ( isObjectEmpty(peerUser) ) {
        return {
          ...state,
          peerUser: user
        };
      }

      return {
        ...state
      };
    case SOCKET_BROADCAST_ACCEPT_VIDEO_CALL:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export default videoCall;
