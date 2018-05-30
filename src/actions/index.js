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
  changeChatRoom,
  createGroupChatRoom,
  createDirectChatRoom,
  socketJoinChatRoom,
  socketLeaveChatRoom
} from './chat-room';
import {
  fetchMessages,
  sendMessage
} from './message';
import {
  kickMember,
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
    changeChatRoom,
    createGroupChatRoom,
    createDirectChatRoom,
    socketJoinChatRoom,
    socketLeaveChatRoom,
    fetchMessages,
    sendMessage,
    kickMember,
    updateMemberRole,
    muteMember
  }, dispatch);
}

export default actions;
