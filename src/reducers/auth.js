import {
  LOGIN,
  REGISTER,
  GUEST_LOGIN,
  LOGOUT
} from '../constants/auth';

const initialState = {
  isLoading: false,
  isAuthenticated: false
};

const auth = (state=initialState, action) => {
  switch(action.type) {
    case `${LOGIN}_LOADING`:
    case `${REGISTER}_LOADING`:
    case `${GUEST_LOGIN}_LOADING`:
    case `${LOGOUT}_LOADING`:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false
      };
    case `${LOGIN}_SUCCESS`:
    case `${REGISTER}_SUCCESS`:
    case `${GUEST_LOGIN}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true
      };
    case `${LOGOUT}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };
    case `${LOGIN}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isLoginError: true
      };
    case `${REGISTER}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isRegisterError: true
      };
    case `${GUEST_LOGIN}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isGuestLoginError: true
      };
    case `${LOGOUT}_ERROR`:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default auth;
