import axios from 'axios';
import {
  FETCH_NEW_MESSAGES,
  FETCH_OLD_MESSAGES,
  SEND_MESSAGE,
  SOCKET_SEND_MESSAGE,
  DELETE_MESSAGE,
  SOCKET_DELETE_MESSAGE
} from '../constants/message';

/**
 * Fetch new messages
 * @param {string} chatRoomID
 * @param {string} userID
 */
export function fetchNewMessages(chatRoomID, userID) {
  let data = {
    chatRoomID: chatRoomID,
    userID: userID
  };

  return dispatch => {
    return dispatch({
      type: FETCH_NEW_MESSAGES,
      payload: axios.post('/message', data),
      meta: chatRoomID
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}

/**
 * Send text message
 * @param {string} newMessageID
 * @param {string} text
 * @param {Object} user
 * @param {string} chatRoomID
 */
export function sendTextMessage(newMessageID, text, user, chatRoomID, textColor) {
  let data = {
    text: text,
    userID: user._id,
    chatRoomID: chatRoomID,
    textColor: textColor
  };

  const messageUser = {
    _id: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
    role: user.role,
    accountType: user.accountType
  };

  return dispatch => {
    dispatch({
      type: SEND_MESSAGE,
      message: {
        _id: newMessageID,
        createdAt: (new Date()).toString(),
        text: text,
        user: messageUser,
        chatRoom: chatRoomID,
        messageType: 'text',
        textColor: textColor,
        isSending: true
      }
    });
    dispatch({
      type: SEND_MESSAGE,
      payload: axios.post('/message/text', data),
      meta: newMessageID
    })
    .then((response) => {
      dispatch({
        type: SOCKET_SEND_MESSAGE,
        message: response.action.payload.data.messageData,
        userID: user._id,
        chatRoomID: chatRoomID
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
 * Send file message
 * @param {string} newMessageID
 * @param {string} text
 * @param {Object} file
 * @param {Object} user
 * @param {string} chatRoomID
 */
export function sendFileMessage(newMessageID, text, file, user, chatRoomID) {
  let data = new FormData();
  data.append('text', text);
  data.append('file', file);
  data.append('userID', user._id);
  data.append('chatRoomID', chatRoomID);

  const messageUser = {
    _id: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
    role: user.role,
    accountType: user.accountType
  };

  let config = {
    headers: {
      'content-type': 'multipart/form-data',
    }
  };

  var messageType = 'file';

  if ( file.type.indexOf('image/') > -1 ) {
    messageType = 'image';
  }

  return dispatch => {
    dispatch({
      type: SEND_MESSAGE,
      message: {
        _id: newMessageID,
        createdAt: (new Date()).toString(),
        text: text,
        user: messageUser,
        chatRoom: chatRoomID,
        messageType: messageType,
        fileLink: '',
        isSending: true
      }
    });

    dispatch({
      type: SEND_MESSAGE,
      payload: axios.post('/message/file', data, config),
      meta: newMessageID
    })
    .then((response) => {
      dispatch({
        type: SOCKET_SEND_MESSAGE,
        message: response.action.payload.data.messageData,
        userID: user._id,
        chatRoomID: chatRoomID
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
 * Send image message
 * @param {string} newMessageID
 * @param {string} text
 * @param {Object} image
 * @param {Object} user
 * @param {string} chatRoomID
 */
export function sendImageMessage(newMessageID, text, image, user, chatRoomID) {
  let data = new FormData();
  data.append('text', text);
  data.append('image', image);
  data.append('userID', user._id);
  data.append('chatRoomID', chatRoomID);

  const messageUser = {
    _id: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
    role: user.role,
    accountType: user.accountType
  };

  let config = {
    headers: {
      'content-type': 'multipart/form-data',
    }
  };

  return dispatch => {
    dispatch({
      type: SEND_MESSAGE,
      message: {
        _id: newMessageID,
        createdAt: (new Date()).toString(),
        text: text,
        user: messageUser,
        chatRoom: chatRoomID,
        messageType: 'image',
        fileLink: '',
        isSending: true
      }
    });

    dispatch({
      type: SEND_MESSAGE,
      payload: axios.post('/message/image', data, config),
      meta: newMessageID
    })
    .then((response) => {
      dispatch({
        type: SOCKET_SEND_MESSAGE,
        message: response.action.payload.data.messageData,
        userID: user._id,
        chatRoomID: chatRoomID
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
 * Send audio message
 * @param {string} newMessageID
 * @param {string} text
 * @param {Object} audioBlob
 * @param {Object} user
 * @param {string} chatRoomID
 */
export function sendAudioMessage(newMessageID, text, audioBlob, user, chatRoomID) {
  let audio = new Blob([audioBlob], {type: "audio/webm"});

  let data = new FormData();
  data.append('text', text);
  data.append('audio', audio);
  data.append('userID', user._id);
  data.append('chatRoomID', chatRoomID);

  const messageUser = {
    _id: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
    role: user.role,
    accountType: user.accountType,
    blocked: false,
    ban: {
      data: false,
    }
  };

  let config = {
    headers: {
      'content-type': 'multipart/form-data',
    }
  };

  return dispatch => {
    dispatch({
      type: SEND_MESSAGE,
      message: {
        _id: newMessageID,
        createdAt: (new Date()).toString(),
        text: text,
        user: messageUser,
        chatRoom: chatRoomID,
        messageType: 'audio',
        fileLink: '',
        isSending: true
      }
    });

    dispatch({
      type: SEND_MESSAGE,
      payload: axios.post('/message/audio', data, config),
      meta: newMessageID
    })
    .then((response) => {
      dispatch({
        type: SOCKET_SEND_MESSAGE,
        message: response.action.payload.data.messageData,
        userID: user._id,
        chatRoomID: chatRoomID
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
 * Delete message
 * @param {string} messageID
 * @param {string} chatRoomID
 */
export function deleteMessage(messageID, chatRoomID) {
  let data = {
    messageID,
    chatRoomID
  };

  return dispatch => {
    return dispatch({
      type: DELETE_MESSAGE,
      payload: axios.post('/message/delete', data),
      meta: {
        messageID: messageID,
        chatRoomID: chatRoomID
      }
    })
    .then((response) => {
      dispatch({
        type: SOCKET_DELETE_MESSAGE,
        messageID: messageID,
        chatRoomID: chatRoomID
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    });
  }
}
