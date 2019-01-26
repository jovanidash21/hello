import {
  START_LIVE_VIDEO,
  SOCKET_REQUEST_LIVE_VIDEO,
  END_LIVE_VIDEO,
  SOCKET_BROADCAST_END_LIVE_VIDEO
} from '../constants/live-video';

const commonStateFlags = {
  loading: false,
  success: false,
  error: false,
  message: ''
};

const initialState = {
  start: {...commonStateFlags},
  user: {}
};


const liveVideo = (state=initialState, action) => {
  switch(action.type) {
    case `${START_LIVE_VIDEO}_LOADING`:
      var liveVideoUser = action.meta;

      return {
        ...state,
        start: {
          ...state.start,
          loading: true
        },
        user: {...liveVideoUser}
      };
    case `${START_LIVE_VIDEO}_SUCCESS`:
      return {
        ...state,
        start: {
          ...state.start,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        }
      };
    case `${END_LIVE_VIDEO}_SUCCESS`:
      return {
        ...state,
        user: {}
      };
    case `${START_LIVE_VIDEO}_ERROR`:
      return {
        ...state,
        start: {
          ...state.start,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    case SOCKET_REQUEST_LIVE_VIDEO:
      var liveVideoUser = action.user;

      return {
        ...state,
        user: {...liveVideoUser}
      };
    case SOCKET_BROADCAST_END_LIVE_VIDEO:
      var userID = action.userID;
      var liveVideoUser = {...state.user};

      if ( liveVideoUser._id === userID ) {
        return {
          ...state,
          user: {}
        };
      }

      return {
        ...state
      };
    default:
      return state;
  }
}

export default liveVideo;
