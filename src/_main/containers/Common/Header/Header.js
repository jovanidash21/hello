import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'muicss/react/';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { isObjectEmpty } from '../../../../utils/object';
import { isDirectChatRoomMemberOnline } from '../../../../utils/member';
import {
  NewMessagesDropdown,
  ChatRoomDropdown
} from '../../../components/Header';
import { UserDropdown } from '../../../../components/UserDropdown';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleVideoCamRender() {
    const {
      user,
      chatRoom
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;

    if (
      !isObjectEmpty(activeChatRoom.data) &&
      activeChatRoom.data.chatType === 'direct' &&
      !chatRoom.fetch.loading &&
      chatRoom.fetch.success &&
      isDirectChatRoomMemberOnline(activeChatRoom.data.members, activeUser._id)
    ) {
      return (
        <div className="header-item-icon video-cam-icon" onClick={::this.handleRequestVideoCall}>
          <FontAwesome name="video-camera" />
        </div>
      )
    }
  }
  handleNewMessagesDropdownRender() {
    const {
      user,
      chatRoom,
      changeChatRoom,
      handleOpenPopUpChatRoom,
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
          handleOpenPopUpChatRoom={handleOpenPopUpChatRoom}
          handleChangeChatRoom={changeChatRoom}
          handleClearChatRoomUnreadMessages={::this.handleClearChatRoomUnreadMessages}
        />
      )
    }
  }
  handleChatRoomDropdownRender() {
    const {
      user,
      chatRoom,
      handleOpenLiveVideo
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;

    if (
      !isObjectEmpty(activeChatRoom.data) &&
      activeChatRoom.data.chatType === 'public' &&
      !chatRoom.fetch.loading &&
      chatRoom.fetch.success
    ) {
      return (
        <ChatRoomDropdown
          activeUser={activeUser}
          handleOpenLiveVideo={handleOpenLiveVideo}
        />
      )
    }
  }
  handleRequestVideoCall(event) {
    event.preventDefault();

    const {
      chatRoom,
      handleRequestVideoCall
    } = this.props;

    if ( chatRoom.active.data.chatType === 'direct' ) {
      handleRequestVideoCall(chatRoom.active);
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
        {::this.handleVideoCamRender()}
        {::this.handleNewMessagesDropdownRender()}
        {::this.handleChatRoomDropdownRender()}
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

Header.propTypes = {
  handleOpenPopUpChatRoom: PropTypes.func.isRequired,
  handleRequestVideoCall: PropTypes.func.isRequired,
  handleOpenLiveVideo: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
