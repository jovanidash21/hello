import axios from 'axios';
import {
  UPDATE_MEMBER_DATA,
  SOCKET_UPDATE_MEMBER_DATA
} from '../constants/member';

export function updateMemberRole(data) {
  return dispatch => {
    return dispatch({
      type: UPDATE_MEMBER_DATA,
      payload: axios.post('api/user/role', data)
    })
    .then((response) => {
      dispatch({
        type: SOCKET_UPDATE_MEMBER_DATA,
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
