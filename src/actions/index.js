import { bindActionCreators } from 'redux';
import {
  socketUserLogin,
  localLogin,
  facebookLogin,
  googleLogin,
  twitterLogin,
  instagramLogin,
  linkedinLogin,
  githubLogin,
  register,
  guestLogin,
  logout
} from './auth';
import {
  fetchUser,
  fetchUsers
} from './user';
import { sendEmail } from './email';
import {
  socketIsTyping,
  socketIsNotTyping
} from './typer';
import {
  fetchChatRooms,
  createGroupChatRoom,
  createDirectChatRoom,
  socketJoinChatRoom,
  socketLeaveChatRoom
} from './chat-room';
import { changeChatRoom } from './active-chat-room';
import {
  fetchMessages,
  sendMessage
} from './message';
import {
  updateMemberRole,
  muteMember
} from './member';

const actions = (dispatch) => {
  return bindActionCreators({
    socketUserLogin,
    localLogin,
    facebookLogin,
    googleLogin,
    twitterLogin,
    instagramLogin,
    linkedinLogin,
    githubLogin,
    register,
    guestLogin,
    logout,
    fetchUser,
    fetchUsers,
    socketIsTyping,
    socketIsNotTyping,
    fetchChatRooms,
    createGroupChatRoom,
    createDirectChatRoom,
    socketJoinChatRoom,
    socketLeaveChatRoom,
    changeChatRoom,
    fetchMessages,
    sendMessage,
    updateMemberRole,
    muteMember
  }, dispatch);
}

export default actions;
