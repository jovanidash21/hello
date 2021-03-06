import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import { Avatar } from '../../../components/Avatar';
import './styles.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  handleSelectChatRoom(event) {
    event.preventDefault();

    const {
      chatRoom,
      handleSelectChatRoom
    } = this.props;

    if ( chatRoom.data.connectedMembers.length < 500 ) {
      handleSelectChatRoom(chatRoom);
    } else {
      Popup.alert('Sorry, maximum of 500 users only per Public Chat Room!');
    }
  }
  render() {
    const { chatRoom } = this.props;
    const chatRoomData = chatRoom.data;

    return (
      <div className="chat-room-menu-item" onClick={::this.handleSelectChatRoom}>
        <MediaQuery query="(min-width: 768px)">
          {(matches) => {
            return (
              <Avatar
                image={chatRoomData.chatIcon}
                size={matches ? '70px' : '25px'}
                name={chatRoomData.name}
                roleChatType={chatRoomData.chatType}
                badgeBigger={matches}
                badgeCloser={matches}
              />
            )
          }}
        </MediaQuery>
        <div className="chat-room-name">
          {chatRoom.data.name}
        </div>
      </div>
    )
  }
}

ChatRoom.propTypes = {
  chatRoom: PropTypes.object.isRequired,
  handleSelectChatRoom: PropTypes.func.isRequired
}

export default ChatRoom;
