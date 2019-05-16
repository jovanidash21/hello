import axios from 'axios';
import { FETCH_BANNED_USERS } from '../constants/banned-user';

/**
 * Fetch banned users
 */
export function fetchBannedUsers() {
  return dispatch => {
    return dispatch({
      type: FETCH_BANNED_USERS,
      payload: axios.post( 'banned-user' ),
    })
    .catch(( error ) => {
      if ( error instanceof Error ) {
        console.log( error );
      }
    });
  }
}
