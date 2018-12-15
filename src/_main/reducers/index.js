import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { loadingBarReducer } from 'react-redux-loading-bar';
import history from '../../history';
import auth from './auth';
import user from './user';
import email from './email';
import chatRoom from './chat-room';
import message from './message';
import member from './member';
import { LOGOUT } from '../constants/auth';

const appReducer = combineReducers({
  router: connectRouter(history),
  loadingBar: loadingBarReducer,
  auth,
  user,
  email,
  chatRoom,
  message,
  member
});

const rootReducer = (state, action) => {
  if (action.type === `${LOGOUT}_SUCCESS`) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
