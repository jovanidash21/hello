import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { loadingBarReducer } from 'react-redux-loading-bar';
import history from '../../history';
import auth from './auth';
import user from './user';
import email from './email';
import chatRoom from './chat-room';
import popUpChatRoom from './popup-chat-room';
import message from './message';
import member from './member';
import liveVideoUser from './live-video-user';
import videoCall from './video-call';
import blockedUser from './blocked-user';
import upload from './upload';

const appReducer = combineReducers({
  router: connectRouter(history),
  loadingBar: loadingBarReducer,
  auth,
  user,
  email,
  chatRoom,
  popUpChatRoom,
  message,
  member,
  liveVideoUser,
  videoCall,
  blockedUser,
  upload
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
}

export default rootReducer;
