import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
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

    handleSelectChatRoom(chatRoom);
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
