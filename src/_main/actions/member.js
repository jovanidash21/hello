import axios from 'axios';
import {
  FETCH_MEMBERS,
  KICK_MEMBER,
  SOCKET_KICK_MEMBER,
  UPDATE_MEMBER_ROLE,
  SOCKET_UPDATE_MEMBER_ROLE,
  MUTE_MEMBER,
  SOCKET_MUTE_MEMBER,
  BLOCK_MEMBER,
  SOCKET_BLOCK_MEMBER
} from '../constants/member';

const localtionArr = window.location.href.split("/");
const baseURL = localtionArr[0] + "//" + localtionArr[2];

/**
 * Fetch members
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function fetchMembers(chatRoomID, userID) {
  return dispatch => {
    return dispatch({
      type: FETCH_MEMBERS,
      payload: axios.get(baseURL + `/api/member/${chatRoomID}/${userID}`)
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
      payload: axios.post(baseURL + '/api/member/block', data)
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
      payload: axios.post(baseURL + '/api/member/kick', data)
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
      payload: axios.post(baseURL + '/api/member/role', data)
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
      payload: axios.post(baseURL + '/api/member/mute', data)
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