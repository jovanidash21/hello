import axios from 'axios';
import {
  OPEN_POPUP_CHAT_ROOM,
  CLOSE_POPUP_CHAT_ROOM
} from '../constants/popup-chat-room';
import {
  joinChatRoom,
  leaveChatRoom
} from './chat-room';
import { fetchNewMessages } from './message';

/**
 * Open popup chat room
 * @param {Object} chatRoom
 * @param {string} userID
 * @param {string} activeChatRoomID
 * @param {string} connectedChatRoomID
 */
export function openPopUpChatRoom(chatRoom, userID, activeChatRoomID, connectedChatRoomID) {
  const commonStateFlags = {
    loading: false,
    success: false,
    error: false,
    message: ''
  };

  const extraChatRoomData = {
    message: {
      fetchNew: {...commonStateFlags},
      delete: {...commonStateFlags},
      all: []
    }
  };

  return dispatch => {
    dispatch({
      type: OPEN_POPUP_CHAT_ROOM,
      chatRoom: {
        ...chatRoom,
        ...extraChatRoomData
      }
    });
    dispatch(joinChatRoom(chatRoom.data._id, userID, connectedChatRoomID));
    dispatch(fetchNewMessages(chatRoom.data._id, userID));
  }
}

/**
 * Close popup chat room
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function closePopUpChatRoom(chatRoomID, userID) {
  return dispatch => {
    dispatch({
      type: CLOSE_POPUP_CHAT_ROOM,
      chatRoomID: chatRoomID
    });
    dispatch(leaveChatRoom(chatRoomID, userID));
  }
}
