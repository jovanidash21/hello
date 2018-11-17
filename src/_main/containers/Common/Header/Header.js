import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'muicss/react/';
import mapDispatchToProps from '../../../actions';
import { NewMessagesDropdown } from '../../../components/Header';
import { UserDropdown } from '../../../../components/UserDropdown';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleNewMessagesDropdownRender() {
    const {
      user,
      chatRoom,
      changeChatRoom,
      children
    } = this.props;
    const newMessagesChatRooms = chatRoom.all.filter((singleChatRoom) =>
      singleChatRoom.data.chatType === 'direct' &&
      singleChatRoom.unReadMessages > 0
    ).sort((a, b) => {
      var date = new Date(b.data.latestMessageDate) - new Date(a.data.latestMessageDate);
      var name = a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
      var priority = a.priority - b.priority;

      if ( date !== 0 ) {
        return date;
      } else if ( name !== 0 ) {
        return name;
      } else {
        return priority;
      }
    });

    if ( !chatRoom.fetch.loading && chatRoom.fetch.success ) {
      return (
        <NewMessagesDropdown
          user={user.active}
          chatRooms={newMessagesChatRooms}
          activeChatRoom={chatRoom.active}
          handleChangeChatRoom={changeChatRoom}
          handleClearChatRoomUnreadMessages={::this.handleClearChatRoomUnreadMessages}
        />
      )
    }
  }
  handleClearChatRoomUnreadMessages(chatRoomIDs) {
    const {
      user,
      clearChatRoomUnreadMessages
    } = this.props;

    clearChatRoomUnreadMessages(user.active._id, chatRoomIDs);
  }
  render() {
    const {
      user,
      children
    } = this.props;

    return (
      <Appbar className="header">
        <div className="content">
          {children}
        </div>
        {::this.handleNewMessagesDropdownRender()}
        <UserDropdown user={user.active} />
      </Appbar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
