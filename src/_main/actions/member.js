import axios from 'axios';
import {
  FETCH_MEMBERS,
  KICK_MEMBER,
  SOCKET_KICK_MEMBER,
  UPDATE_MEMBER_ROLE,
  SOCKET_UPDATE_MEMBER_ROLE,
  MUTE_MEMBER,
  SOCKET_MUTE_MEMBER,
  SOCKET_BLOCK_MEMBER
} from '../constants/member';

/**
 * Fetch members
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function fetchMembers(chatRoomID, userID) {
  let data = {
    chatRoomID,
    userID
  };

  return dispatch => {
    return dispatch({
      type: FETCH_MEMBERS,
      payload: axios.post('/member', data)
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Block member
 * @param {string} memberID
 */
export function blockMember(memberID) {
  let data = { memberID };

  return dispatch => {
    return dispatch({
      type: BLOCK_MEMBER,
      payload: axios.post('/member/block', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_BLOCK_MEMBER,
        memberID: memberID
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
 * Kick member
 * @param {string} chatRoomID
 * @param {string} memberID
 */
export function kickMember(chatRoomID, memberID) {
  let data = {
    chatRoomID,
    memberID,
  };

  return dispatch => {
    return dispatch({
      type: KICK_MEMBER,
      payload: axios.post('/member/kick', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_KICK_MEMBER,
        chatRoomID: chatRoomID,
        memberID: memberID
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

  console.log(data);

  return dispatch => {
    return dispatch({
      type: UPDATE_MEMBER_ROLE,
      payload: axios.post('/member/role', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_UPDATE_MEMBER_ROLE,
        memberID: memberID,
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
  let data = { memberID };

  return dispatch => {
    return dispatch({
      type: MUTE_MEMBER,
      payload: axios.post('/member/mute', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_MUTE_MEMBER,
        memberID: memberID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
