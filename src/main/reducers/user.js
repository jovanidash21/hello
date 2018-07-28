import {
  FETCH_USER,
  FETCH_USERS
} from '../constants/user';
import {
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER
} from '../constants/member';

const initialState = {
  isLoading: false,
  active: {},
  all: []
};

const user = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_USER}_LOADING`:
      return {
        ...state,
        isLoading: true
      };
    case `${FETCH_USER}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        active: action.payload.data
      };
    case `${FETCH_USERS}_SUCCESS`:
      return {
        ...state,
        isSuccess: true,
        all: action.payload.data
      };
    case `${FETCH_USER}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case SOCKET_BROADCAST_MUTE_MEMBER:
      var memberID = action.memberID;
      var user = {...state.active};

      if ( memberID === user._id ) {
        user.mute.data = true;
      }

      return {
        ...state,
        active: {...user}
      };
    case SOCKET_BROADCAST_UNMUTE_MEMBER:
      var memberID = action.memberID;
      var user = {...state.active};

      if ( memberID === user._id ) {
        user.mute.data = false;
      }

      return {
        ...state,
        active: {...user}
      };
    default:
      return state;
  }
}

export default user;
