import {
  FETCH_ACTIVE_USER,
  SEARCH_USER
} from '../constants/user';
import {
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER
} from '../constants/member';

const initialState = {
  isFetchingActive: false,
  isFetchingActiveSuccess: false,
  isSearching: false,
  isSearchingSuccess: false,
  active: {},
  search: []
};

const user = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_ACTIVE_USER}_LOADING`:
      return {
        ...state,
        isFetchingActive: true
      };
    case `${SEARCH_USER}_LOADING`:
      return {
        ...state,
        isSearching: true,
        search: []
      };
    case `${FETCH_ACTIVE_USER}_SUCCESS`:
      return {
        ...state,
        isFetchingActive: false,
        isFetchingActiveSuccess: true,
        active: action.payload.data
      };
    case `${SEARCH_USER}_SUCCESS`:
      return {
        ...state,
        isSearching: false,
        isSearchingSuccess: true,
        search: action.payload.data
      };
    case `${FETCH_ACTIVE_USER}_ERROR`:
      return {
        ...state,
        isFetchingActive: false,
        isFetchingActiveSuccess: false
      };
    case `${SEARCH_USER}_ERROR`:
      return {
        ...state,
        isSearching: false,
        isSearchingSuccess: false,
        search: []
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
