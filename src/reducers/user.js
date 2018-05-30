import {
  FETCH_USER,
  FETCH_USERS,
  SOCKET_BROADCAST_MUTE_USER,
  SOCKET_BROADCAST_UNMUTE_USER
} from '../constants/user';

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
    case SOCKET_BROADCAST_MUTE_USER:
      var user = {...state.active};

      user.isMute = true;

      return {
        ...state,
        active: {...user}
      };
    case SOCKET_BROADCAST_UNMUTE_USER:
      var user = {...state.active};

      user.isMute = false;

      return {
        ...state,
        active: {...user}
      };
    default:
      return state;
  }
}

export default user;
