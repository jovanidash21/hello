import axios from 'axios';
import {
  UPDATE_MEMBER_ROLE,
  SOCKET_UPDATE_MEMBER_ROLE,
  MUTE_MEMBER,
  SOCKET_MUTE_MEMBER
} from '../constants/member';

export function updateMemberRole(data) {
  return dispatch => {
    return dispatch({
      type: UPDATE_MEMBER_ROLE,
      payload: axios.post('api/user/role', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_UPDATE_MEMBER_ROLE,
        member: data.userID,
        role: data.role
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

export function muteMember(data) {
  return dispatch => {
    return dispatch({
      type: MUTE_MEMBER,
      payload: axios.post('api/user/mute', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_MUTE_MEMBER,
        member: data.userID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
