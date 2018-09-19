import { bindActionCreators } from 'redux';
import {
  socketUserLogin,
  localLogin,
  facebookLogin,
  googleLogin,
  twitterLogin,
  register,
  guestLogin
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
  socketLeaveChatRoom,
  trashChatRoom
} from './chat-room';
import {
  fetchNewMessages,
  sendTextMessage,
  sendFileMessage,
  sendImageMessage,
  sendAudioMessage,
  deleteMessage
} from './message';
import {
  fetchMembers,
  blockMember,
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
    register,
    guestLogin,
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
    trashChatRoom,
    fetchNewMessages,
    sendTextMessage,
    sendFileMessage,
    sendImageMessage,
    sendAudioMessage,
    deleteMessage,
    fetchMembers,
    blockMember,
    kickMember,
    updateMemberRole,
    muteMember
  }, dispatch);
}

export default actions;
