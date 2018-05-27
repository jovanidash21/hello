import {
  FETCH_USER,
  FETCH_USERS,
  SOCKET_BROADCAST_MUTE_USER,
  SOCKET_BROADCAST_UNMUTE_USER
} from '../constants/user';

const initialState = {
  isLoading: false,
  userData: {},
  users: []
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
        userData: action.payload.data
      };
    case `${FETCH_USERS}_SUCCESS`:
      return {
        ...state,
        isSuccess: true,
        users: action.payload.data
      };
    case `${FETCH_USER}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case SOCKET_BROADCAST_MUTE_USER:
      var user = {...state.userData};

      user.isMute = true;

      return {
        ...state,
        userData: {...user}
      };
    case SOCKET_BROADCAST_UNMUTE_USER:
      var user = {...state.userData};

      user.isMute = false;

      return {
        ...state,
        userData: {...user}
      };
    default:
      return state;
  }
}

export default user;
