import {
  START_LIVE_VIDEO,
  SOCKET_REQUEST_LIVE_VIDEO,
  SET_LIVE_VIDEO_SOURCE,
  END_LIVE_VIDEO,
  SOCKET_BROADCAST_END_LIVE_VIDEO,
  CLOSE_LIVE_VIDEO_USER
} from '../constants/live-video-user';

const initialState = {
  all: []
};


const liveVideoUser = (state=initialState, action) => {
  switch(action.type) {
    case `${START_LIVE_VIDEO}_LOADING`:
      var user = action.meta;
      var liveVideoUsers = [...state.all];

      var liveVideoUserIndex = liveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === user._id);

      if ( liveVideoUserIndex === -1  ) {
        user.video.loading = true;
        liveVideoUsers.push(user);
      }

      return {
        ...state,
        all: [...liveVideoUsers]
      };
    // case `${START_LIVE_VIDEO}_SUCCESS`:
    //   var liveVideoUser = action.meta;
    //   var liveVideos = [...state.all];
    //
    //   var liveVideoIndex = liveVideos.findIndex(singleLiveVideo => singleLiveVideo._id === liveVideoUser._id);
    //
    //   if ( liveVideoIndex === -1  ) {
    //     liveVideoUser.video.loading = true;
    //     liveVideos.push(liveVideoUser);
    //   }
    //
    //   return {
    //     ...state,
    //     all: [...liveVideos]
    //   };
    // case `${END_LIVE_VIDEO}_SUCCESS`:
    //   return {
    //     ...state,
    //     user: {}
    //   };
    // case `${START_LIVE_VIDEO}_ERROR`:
    //   return {
    //     ...state,
    //     start: {
    //       ...state.start,
    //       loading: false,
    //       success: false,
    //       error: true,
    //       message: action.payload.response.data.message
    //     }
    //   };
    case SOCKET_REQUEST_LIVE_VIDEO:
      var user = action.user;
      var liveVideoUsers = [...state.all];

      var liveVideoUserIndex = liveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === user._id);

      if ( liveVideoUserIndex === -1  ) {
        user.video.loading = true;
        liveVideoUsers.push(user);
      }

      return {
        ...state,
        all: [...liveVideoUsers]
      };
    case SET_LIVE_VIDEO_SOURCE:
      var userID = action.userID;
      var liveVideoUsers = [...state.all];

      var liveVideoUserIndex = liveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === userID);

      if ( liveVideoUserIndex > -1  ) {
        liveVideoUsers[liveVideoUserIndex].video = {
          loading: false,
          source: action.source
        };
      }

      return {
        ...state,
        all: [...liveVideoUsers]
      };
    // case SOCKET_BROADCAST_END_LIVE_VIDEO:
    //   var userID = action.userID;
    //   var liveVideoUser = {...state.user};
    //
    //   if ( liveVideoUser._id === userID ) {
    //     return {
    //       ...state,
    //       user: {}
    //     };
    //   }
    //
    //   return {
    //     ...state
    //   };
      case CLOSE_LIVE_VIDEO_USER:
        var userID = action.userID;
        var liveVideoUsers = [...state.all];

        liveVideoUsers = liveVideoUsers.filter(singleLiveVideoUser =>
          singleLiveVideoUser._id !== userID
        );

        return {
          ...state,
          all: [...liveVideoUsers]
        };
    default:
      return state;
  }
}

export default liveVideoUser;
