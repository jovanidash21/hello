import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Avatar from '../Avatar';
import './styles.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const {
      index,
      userData,
      chatRoomData,
      handleChangeChatRoom
    } = this.props;

    if (index === 0) {
      handleChangeChatRoom(chatRoomData, userData._id, '');
    }
  }
  handleAvatar(type) {
    const {
      userData,
      chatRoomData
    } = this.props;
    var role = '';
    var accountType = '';

    switch ( chatRoomData.chatType ) {
      case 'private':
        role = userData.role;
        accountType = userData.accountType;
        break;
      case 'direct':
        for ( var i = 0; i < chatRoomData.members.length; i++ ) {
          var member = chatRoomData.members[i];

          if ( member._id != userData._id ) {
            role = member.role;
            accountType = member.accountType;
            break;
          } else {
            continue;
          }
        }
        break;
      default:
        break;
    }

    if ( type === 'role' ) {
      return role;
    } else if ( type === 'accountType' ) {
      return accountType;
    }
    return accountType;
  }
  handleChangeChatRoom(event) {
    event.preventDefault();

    const {
      userData,
      chatRoomData,
      activeChatRoom,
      handleChangeChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    handleChangeChatRoom(chatRoomData, userData._id, activeChatRoom._id);
    handleLeftSideDrawerToggleEvent(event);
  }
  render() {
    const {
      chatRoomData,
      isActive
    } = this.props;

    return (
      <div
        className={"chat-room " + (isActive ? 'active' : '')}
        onClick={::this.handleChangeChatRoom}
        title={chatRoomData.name}
      >
        <Avatar
          image={chatRoomData.chatIcon}
          role={::this.handleAvatar('role')}
          accountType={::this.handleAvatar('accountType')}
        />
        <div className="chat-room-name">
          {chatRoomData.name}
          {
            chatRoomData.chatType === 'private' &&
            <span className="you-label">(you)</span>
          }
        </div>
      </div>
    )
  }
}

ChatRoom.propTypes = {
  index: PropTypes.number,
  userData: PropTypes.object.isRequired,
  chatRoomData: PropTypes.object.isRequired,
  activeChatRoom: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  handleChangeChatRoom: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

ChatRoom.defaultProps = {
  index: -1,
  isActive: false
}

export default ChatRoom;
