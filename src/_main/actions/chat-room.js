import axios from 'axios';
import {
  FETCH_CHAT_ROOMS,
  CHANGE_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  SOCKET_CREATE_CHAT_ROOM,
  SOCKET_JOIN_CHAT_ROOM,
  SOCKET_LEAVE_CHAT_ROOM,
  TRASH_CHAT_ROOM
} from '../constants/chat-room';
import { fetchNewMessages } from './message';
import { fetchMembers } from './member';

const localtionArr = window.location.href.split("/");
const baseURL = localtionArr[0] + "//" + localtionArr[2];

/**
 * Fetch chat rooms
 * @param {string} userID
 */
export function fetchChatRooms(userID) {
  let data = { userID };

  return dispatch => {
    return dispatch({
      type: FETCH_CHAT_ROOMS,
      payload: axios.post(baseURL + '/api/chat-room', data)
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Change chat room
 * @param {Object} chatRoom
 * @param {string} userID
 * @param {string} activeChatRoomID
 */
export function changeChatRoom(chatRoom, userID, activeChatRoomID) {
  return dispatch => {
    dispatch({
      type: CHANGE_CHAT_ROOM,
      chatRoom: chatRoom
    });
    dispatch(leaveChatRoom(activeChatRoomID, userID));
    dispatch(joinChatRoom(chatRoom.data._id, userID));
    dispatch(fetchNewMessages(chatRoom.data._id, userID));
    dispatch(fetchMembers(chatRoom.data._id, userID));
  }
}

/**
 * Create chat room
 * @param {string} userID
 * @param {Object} chatRoom
 * @param {string} activeChatRoomID
 */
function createChatRoom(userID, chatRoom, activeChatRoomID) {
  return dispatch => {
    var chatRoomBroadcast = {...chatRoom};
    var membersBroadcast = chatRoomBroadcast.data.members.slice();
    var index = -1;

    for (var i = 0; i < membersBroadcast.length; i++) {
      var member = membersBroadcast[i];

      if (member._id == userID) {
        index = i;
        break;
      } else {
        continue;
      }
    }

    if ( index != -1 ) {
    	membersBroadcast.splice(index, 1);
    }

    var chatRoomData = {...chatRoom.data};

    if (chatRoom.data.chatType === 'direct') {
      for (var j = 0; j < chatRoom.data.members.length; j++) {
        var member = chatRoom.data.members[j];

        if (member._id != userID) {
          chatRoomData.name = member.name;
          chatRoomData.chatIcon = member.profilePicture;
        } else {
          chatRoomBroadcast.data.name = member.name;
          chatRoomBroadcast.data.chatIcon = member.profilePicture;
        }
      }
    }

    chatRoom.data = chatRoomData;

    dispatch({
      type: SOCKET_CREATE_CHAT_ROOM,
      chatRoom: chatRoom,
      chatRoomBroadcast: chatRoomBroadcast,
      members: membersBroadcast
    });
    dispatch(changeChatRoom(chatRoom, userID, activeChatRoomID));
  }
}

/**
 * Create public chat room
 * @param {string} name
 * @param {string} userID
 * @param {string} activeChatRoomID
 */
export function createPublicChatRoom(name, userID, activeChatRoomID) {
  let data = {
    name,
    userID,
    chatType: 'public'
  };

  return dispatch => {
    return dispatch({
      type: CREATE_CHAT_ROOM,
      payload: axios.post(baseURL + '/api/chat-room/create', data)
    })
    .then((response) => {
      dispatch(createChatRoom(userID, response.action.payload.data.chatRoom, activeChatRoomID));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Create group chat room
 * @param {string} name
 * @param {Array} members
 * @param {string} userID
 * @param {string} activeChatRoomID
 */
export function createGroupChatRoom(name, members, userID, activeChatRoomID) {
  let data = {
    name,
    members,
    userID,
    chatType: 'group'
  };

  return dispatch => {
    return dispatch({
      type: CREATE_CHAT_ROOM,
      payload: axios.post(baseURL + '/api/chat-room/create', data)
    })
    .then((response) => {
      dispatch(createChatRoom(userID, response.action.payload.data.chatRoom, activeChatRoomID));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Create direct chat room
 * @param {string} userID
 * @param {string} memberID
 * @param {string} activeChatRoomID
 */
export function createDirectChatRoom(userID, memberID, activeChatRoomID) {
  let data = {
    name: '',
    members: [userID, memberID],
    userID,
    chatType: 'direct'
  };

  return dispatch => {
    return dispatch({
      type: CREATE_CHAT_ROOM,
      payload: axios.post(baseURL + '/api/chat-room/create', data)
    })
    .then((response) => {
      dispatch(createChatRoom(userID, response.action.payload.data.chatRoom, activeChatRoomID));
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Socket join chat room
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function joinChatRoom(chatRoomID, userID) {
  return {
    type: SOCKET_JOIN_CHAT_ROOM,
    chatRoomID: chatRoomID,
    userID: userID
  };
}

/**
 * Socket leave chat room
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function leaveChatRoom(chatRoomID, userID) {
  return {
    type: SOCKET_LEAVE_CHAT_ROOM,
    chatRoomID: chatRoomID,
    userID: userID
  };
}

/**
 * Trash chat room
 * @param {string} userID
 * @param {string} chatRoomID
 */
export function trashChatRoom(userID, chatRoomID) {
  let data = {
    userID,
    chatRoomID
  };

  return dispatch => {
    return dispatch({
      type: TRASH_CHAT_ROOM,
      payload: axios.post(baseURL + '/api/chat-room/trash', data),
      meta: chatRoomID
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
