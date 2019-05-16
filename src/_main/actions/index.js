import { bindActionCreators } from 'redux';
import {
  socketUserLogin,
  localLogin,
  facebookLogin,
  googleLogin,
  twitterLogin,
  register,
  guestLogin,
} from './auth';
import {
  fetchActiveUser,
  editActiveUser,
  searchUser,
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
  trashChatRoom,
} from './chat-room';
import {
  openPopUpChatRoom,
  closePopUpChatRoom,
} from './popup-chat-room';
import {
  fetchNewMessages,
  sendTextMessage,
  sendFileMessage,
  sendImageMessage,
  sendAudioMessage,
  deleteMessage,
} from './message';
import {
  fetchMembers,
  blockMember,
  kickMember,
  updateMemberRole,
  muteMember,
} from './member';
import {
  startLiveVideo,
  requestLiveVideo,
  acceptLiveVideo,
  setLiveVideoSource,
  endLiveVideo,
  closeLiveVideoUser,
} from './live-video-user';
import {
  requestVideoCall,
  cancelRequestVideoCall,
  rejectVideoCall,
  acceptVideoCall,
  endVideoCall,
} from './video-call';
import {
  fetchBlockedUsers,
  blockUser,
  unblockUser,
  unblockAllUsers,
} from './blocked-user';
import { fetchBannedUsers } from './banned-user';
import { uploadImage } from './upload';

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
    editActiveUser,
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
    requestLiveVideo,
    acceptLiveVideo,
    setLiveVideoSource,
    endLiveVideo,
    closeLiveVideoUser,
    requestVideoCall,
    cancelRequestVideoCall,
    rejectVideoCall,
    acceptVideoCall,
    endVideoCall,
    fetchBlockedUsers,
    blockUser,
    unblockUser,
    unblockAllUsers,
    fetchBannedUsers,
    uploadImage,
  }, dispatch);
}

export default actions;
