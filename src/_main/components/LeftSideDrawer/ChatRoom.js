import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import { handleChatRoomAvatarBadges } from '../../../utils/avatar';
import { Avatar } from '../../../components/Avatar';
import { NotificationCount } from '../../../components/NotificationCount';
import './styles.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  handleOpenPopUpChatRoom(event) {
    event.preventDefault();

    const {
      chatRoom,
      handleOpenPopUpChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    if ( chatRoom.data.chatType === 'direct' ) {
      handleOpenPopUpChatRoom(chatRoom);
      handleLeftSideDrawerToggleEvent();
    }
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

    if (
      ( chatRoom.data.chatType === 'public' ) &&
      ( chatRoom.data.connectedMembers.length >= 500 )
    ) {
      Popup.alert('Sorry, maximum of 500 users only per Public Chat Room!');
    } else {
      handleChangeChatRoom(chatRoom, user._id, activeChatRoom.data._id, user.connectedChatRoom);
      handleLeftSideDrawerToggleEvent();
    }
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

    if ( chatRoom.data.chatType === 'direct' ) {
      handleTrashChatRoom(chatRoom.data._id);
    }
  }
  render() {
    const {
      user,
      chatRoom,
      isActive,
      isTrashing,
    } = this.props;

    return (
      <MediaQuery query="(max-width: 767px)">
        {(matches) => {
          return (
            <div
              className={
                "chat-room " +
                (isActive ? 'active ' : '') +
                (
                  (chatRoom.unReadMessages > 0 && chatRoom.data.chatType === 'direct')
                  ? 'new-message ' : ''
                ) +
                (
                  isTrashing ||
                  (chatRoom.data.chatType === 'public' && chatRoom.data.connectedMembers.length >= 500)
                  ? 'disabled'
                  : ''
                )
              }
              onClick={!matches && chatRoom.data.chatType === 'direct' ? ::this.handleOpenPopUpChatRoom : ::this.handleChangeChatRoom}
              title={chatRoom.data.name}
            >
              <Avatar
                image={chatRoom.data.chatIcon}
                name={chatRoom.data.name}
                roleChatType={handleChatRoomAvatarBadges(chatRoom.data, user, 'role-chat')}
                accountType={handleChatRoomAvatarBadges(chatRoom.data, user)}
              />
              <div className="chat-room-name">
                {chatRoom.data.name}
              </div>
              {
                chatRoom.unReadMessages > 0 &&
                chatRoom.data.chatType === 'direct' &&
                <NotificationCount
                  count={chatRoom.unReadMessages}
                  title={chatRoom.unReadMessages + " New " + (chatRoom.unReadMessages > 1 ? 'Messages' : 'Message')}
                />
              }
              {
                chatRoom.data.chatType === 'direct' &&
                <div
                  className="trash-icon"
                  title="Trash ChatRoom"
                  onClick={::this.handleTrashChatRoom}>
                  <FontAwesome name="trash" />
                </div>
              }
              {
                chatRoom.data.chatType === 'public' &&
                <div
                  className="connected-members-count"
                  title={chatRoom.data.connectedMembers.length + " Connected Members"}
                >
                  <div className="user-icon">
                    <FontAwesome name="user" />
                  </div>
                  {chatRoom.data.connectedMembers.length}
                </div>
              }
            </div>
          )
        }}
      </MediaQuery>
    )
  }
}

ChatRoom.propTypes = {
  user: PropTypes.object.isRequired,
  chatRoom: PropTypes.object.isRequired,
  activeChatRoom: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  handleOpenPopUpChatRoom: PropTypes.func,
  handleChangeChatRoom: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleTrashChatRoom: PropTypes.func,
  isTrashing: PropTypes.bool
}

ChatRoom.defaultProps = {
  isActive: false,
  handleOpenPopUpChatRoom: () => {},
  handleTrashChatRoom: () => {},
  isTrashing: false
}

export default ChatRoom;
