import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Avatar from '../Avatar';
import './styles.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTrashing: false
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isTrashingAChatRoom && !this.props.isTrashingAChatRoom) {
      this.setState({isTrashing: false});
    }
  }
  handleAvatar(type) {
    const {
      user,
      chatRoom
    } = this.props;
    var role = '';
    var accountType = '';

    switch ( chatRoom.data.chatType ) {
      case 'private':
        role = user.role;
        accountType = user.accountType;
        break;
      case 'direct':
        for ( var i = 0; i < chatRoom.data.members.length; i++ ) {
          var member = chatRoom.data.members[i];

          if ( member._id != user._id ) {
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
      user,
      chatRoom,
      activeChatRoom,
      handleChangeChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    handleChangeChatRoom(chatRoom, user._id, activeChatRoom.data._id);
    handleLeftSideDrawerToggleEvent();
  }
  handleTrashChatRoom(event) {
    event.preventDefault();

    if ( event.stopPropagation ) {
      event.stopPropagation();
    }

    const {
      chatRoom,
      handleTrashChatRoom
    } = this.props;

    this.setState({isTrashing: true});
    handleTrashChatRoom(chatRoom.data._id);
  }
  render() {
    const {
      chatRoom,
      isActive
    } = this.props;
    const { isTrashing } = this.state;

    return (
      <div
        className={
          "chat-room " +
          (isActive ? 'active ' : '') +
          (chatRoom.unReadMessages > 0 ? 'new-message ' : '') +
          (isTrashing ? 'is-trashing' : '')
        }
        onClick={::this.handleChangeChatRoom}
        title={chatRoom.data.name}
      >
        <Avatar
          image={chatRoom.data.chatIcon}
          role={::this.handleAvatar('role')}
          accountType={::this.handleAvatar('accountType')}
        />
        <div className="chat-room-name">
          {chatRoom.data.name}
          {
            chatRoom.data.chatType === 'private' &&
            <span className="you-label">(you)</span>
          }
        </div>
        {
          chatRoom.unReadMessages > 0 &&
          <div
            className="new-messages-count"
            title={chatRoom.unReadMessages + " New " + (chatRoom.unReadMessages > 1 ? 'Messages' : 'Message')}
          >
            {
              chatRoom.unReadMessages <= 100
                ?
                chatRoom.unReadMessages
                :
                '100 +'
            }
          </div>
        }
        {
          chatRoom.data.chatType === 'direct' &&
          <div className="trash-chat-room-button" onClick={::this.handleTrashChatRoom}>
            <FontAwesome name="times" />
          </div>
        }
      </div>
    )
  }
}

ChatRoom.propTypes = {
  user: PropTypes.object.isRequired,
  chatRoom: PropTypes.object.isRequired,
  activeChatRoom: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  handleChangeChatRoom: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleTrashChatRoom: PropTypes.func,
  isTrashingAChatRoom: PropTypes.bool.isRequired
}

ChatRoom.defaultProps = {
  isActive: false,
  handleTrashChatRoom: () => {},
  isTrashingAChatRoom: false

}

export default ChatRoom;
