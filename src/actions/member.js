import axios from 'axios';
import {
  FETCH_MEMBERS,
  KICK_MEMBER,
  SOCKET_KICK_MEMBER,
  UPDATE_MEMBER_ROLE,
  SOCKET_UPDATE_MEMBER_ROLE,
  MUTE_MEMBER,
  SOCKET_MUTE_MEMBER
} from '../constants/member';

/**
 * Fetch members
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function fetchMembers(chatRoomID, userID) {
  return dispatch => {
    return dispatch({
      type: FETCH_MEMBERS,
      payload: axios.get(`/api/member/${chatRoomID}/${userID}`)
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Kick member
 * @param {string} chatRoomID
 * @param {string} memberID
 */
export function kickMember(chatRoomID, memberID) {
  return dispatch => {
    return dispatch({
      type: KICK_MEMBER,
      payload: axios.post(`api/chat-room/kick-user/${chatRoomID}/${memberID}`)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_KICK_MEMBER,
        chatRoom: chatRoomID,
        member: memberID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Update member role
 * @param {string} memberID
 * @param {string} role
 */
export function updateMemberRole(memberID, role) {
  let data = {
    memberID,
    role,
  };

  return dispatch => {
    return dispatch({
      type: UPDATE_MEMBER_ROLE,
      payload: axios.post('api/user/role', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_UPDATE_MEMBER_ROLE,
        member: memberID,
        role: role
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Mute member
 * @param {string} memberID
 */
export function muteMember(memberID) {
  return dispatch => {
    return dispatch({
      type: MUTE_MEMBER,
      payload: axios.post('api/user/mute', memberID)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_MUTE_MEMBER,
        member: memberID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
