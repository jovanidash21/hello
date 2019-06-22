import {
  FETCH_BANNED_USERS,
  BAN_USER,
  UNBAN_USER,
  UNBAN_ALL_USERS,
} from '../constants/banned-user';

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
    case `${BAN_USER}_LOADING`: {
      return {
        ...state,
        ban: {
          ...state.ban,
          loading: true,
        },
      };
    }
    case `${UNBAN_USER}_LOADING`: {
      return {
        ...state,
        unban: {
          ...state.unban,
          loading: true,
        },
      };
    }
    case `${UNBAN_ALL_USERS}_LOADING`: {
      return {
        ...state,
        unbanAll: {
          ...state.unbanAll,
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
    case `${BAN_USER}_SUCCESS`: {
      const bannedUserID = action.meta;
      const bannedUsers = [...state.all];

      const bannedUserIndex = bannedUsers.findIndex(( bannedUser ) => {
        return bannedUser._id === bannedUserID;
      });

      if ( bannedUserIndex > -1 ) {
        bannedUsers[bannedUserIndex].ban.data = true;
      }

      return {
        ...state,
        ban: {
          ...state.ban,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message,
        },
        all: [ ...bannedUsers ],
      };
    }
    case `${UNBAN_USER}_SUCCESS`: {
      const unbannedUserID = action.meta;
      const bannedUsers = [...state.all];

      const bannedUserIndex = bannedUsers.findIndex(( bannedUser ) => {
        return bannedUser._id === unbannedUserID;
      });

      if ( bannedUserIndex > -1 ) {
        bannedUsers[bannedUserIndex].ban.data = false;
      }

      return {
        ...state,
        unban: {
          ...state.unban,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message,
        },
      };
    }
    case `${UNBAN_ALL_USERS}_SUCCESS`: {
      const bannedUsers = [...state.all];

      for ( let i = 0; i < bannedUsers.length; i += 1 ) {
        bannedUsers[i].ban.data = false;
      }

      return {
        ...state,
        unbanAll: {
          ...state.unbanAll,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message,
        },
        all: [ ...bannedUsers ],
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
    case `${BAN_USER}_ERROR`: {
      return {
        ...state,
        ban: {
          ...state.ban,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message,
        },
      };
    }
    case `${UNBAN_USER}_ERROR`: {
      return {
        ...state,
        unban: {
          ...state.unban,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message,
        },
      };
    }
    case `${UNBAN_ALL_USERS}_ERROR`: {
      return {
        ...state,
        unbanAll: {
          ...state.unbanAll,
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
