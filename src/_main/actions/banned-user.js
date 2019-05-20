import axios from 'axios';
import {
  FETCH_BANNED_USERS,
  BAN_USER,
  UNBAN_USER,
  UNBAN_ALL_USERS,
} from '../constants/banned-user';

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

/**
 * Ban user
 *
 * @param {string} banUserID
 * @param {string} banDuration
 */
export function banUser( banUserID, banDuration ) {
  let data = {
    banUserID,
    banDuration,
  };

  return dispatch => {
    return dispatch({
      type: BAN_USER,
      payload: axios.post( 'banned-user/ban', data ),
      meta: banUserID,
    })
    .catch(( error ) => {
      if ( error instanceof Error ) {
        console.log( error );
      }
    });
  }
}

/**
 * Unban user
 *
 * @param {string} unbanUserID
 */
export function unbanUser( unbanUserID ) {
  let data = {
    unbanUserID,
  };

  return dispatch => {
    return dispatch({
      type: UNBAN_USER,
      payload: axios.post( 'banned-user/unban', data ),
      meta: unbanUserID,
    })
    .catch(( error ) => {
      if ( error instanceof Error ) {
        console.log( error );
      }
    });
  }
}

/**
 * Unban all users
 *
 * @param {string} userID
 */
export function unbanAllUsers( userID ) {
  let data = {
    userID,
  };

  return dispatch => {
    return dispatch({
      type: UNBAN_ALL_USERS,
      payload: axios.post( 'banned-user/unban-all', data ),
    })
    .catch(( error ) => {
      if ( error instanceof Error ) {
        console.log( error );
      }
    });
  }
}
