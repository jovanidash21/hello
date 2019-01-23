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
  fetchActiveUser,
  searchUser
} from './user';
import { sendEmail } from './email';
import {
  fetchChatRooms,
  changeChatRoom,
  createPublicChatRoom,
  createGroupChatRoom,
  createDirectChatRoom,
  clearChatRoomUnreadMessages,
  trashAllChatRooms,
  trashChatRoom
} from './chat-room';
import {
  openPopUpChatRoom,
  closePopUpChatRoom
} from './popup-chat-room';
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
import {
  startLiveVideo,
  endLiveVideo
} from './live-video';
import {
  requestVideoCall,
  cancelRequestVideoCall,
  rejectVideoCall,
  acceptVideoCall,
  endVideoCall
} from './video-call';

const actions = (dispatch) => {
  return bindActionCreators({
    socketUserLogin,
    localLogin,
    facebookLogin,
    googleLogin,
    twitterLogin,
    register,
    guestLogin,
    fetchActiveUser,
    searchUser,
    fetchChatRooms,
    changeChatRoom,
    createPublicChatRoom,
    createGroupChatRoom,
    createDirectChatRoom,
    clearChatRoomUnreadMessages,
    trashAllChatRooms,
    trashChatRoom,
    openPopUpChatRoom,
    closePopUpChatRoom,
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
    muteMember,
    startLiveVideo,
    endLiveVideo,
    requestVideoCall,
    cancelRequestVideoCall,
    rejectVideoCall,
    acceptVideoCall,
    endVideoCall
  }, dispatch);
}

export default actions;
