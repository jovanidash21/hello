import { FETCH_BANNED_USERS } from '../constants/banned-user';

const commonStateFlags = {
  loading: false,
  success: false,
  error: false,
  message: '',
};

const initialState = {
  fetch: { ...commonStateFlags },
  ban: { ...commonStateFlags },
  unban: { ...commonStateFlags },
  unbanAll: { ...commonStateFlags },
  all: [],
};

const bannedUser = ( state = initialState, action ) => {
  switch( action.type ) {
    case `${FETCH_BANNED_USERS}_LOADING`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: true,
        },
      };
    }
    case `${FETCH_BANNED_USERS}_SUCCESS`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message,
        },
        all: [ ...action.payload.data.bannedUsers ],
      };
    }
    case `${FETCH_BANNED_USERS}_ERROR`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message,
        },
      };
    }
    default:
      return state;
  }
}

export default bannedUser;
