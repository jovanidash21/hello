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

    this.state = {
      editProfileModalOpen: false,
      blockedUsersListModalOpen: false,
    }
  }
  handleOpenEditProfileModal() {
    this.setState({editProfileModalOpen: true});
  }
  handleCloseEditProfileModal() {
    this.setState({editProfileModalOpen: false});
  }
  handleOpenBlockedUsersListModal() {
    this.setState({blockedUsersListModalOpen: true});
  }
  handleCloseBlockedUsersListModal() {
    this.setState({blockedUsersListModalOpen: false});
  }
  handleUnblockAllUsers() {
    const {
      user,
      unblockAllUsers,
    } = this.props;
    const activeUser = user.active;

    unblockAllUsers(activeUser._id);
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
      handleStartLiveVideo
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
          handleStartLiveVideo={handleStartLiveVideo}
        />
      )
    }
  }
  handleEditProfile(username, name, email, gender, profilePicture) {
    const {
      user,
      editActiveUser
    } = this.props;
    const activeUser = user.active;

    if ( activeUser.accountType === 'local' || activeUser.accountType === 'guest' ) {
      editActiveUser(activeUser._id, username, name, email, gender, profilePicture);
    }
  }
  handleFetchBlockedUsers() {
    const {
      user,
      fetchBlockedUsers,
    } = this.props;
    const activeUser = user.active;

    fetchBlockedUsers(activeUser._id);
  }
  handleUnblockAllUsers() {
    const {
      user,
      unblockAllUsers,
    } = this.props;
    const activeUser = user.active;

    unblockAllUsers(activeUser._id);
  }
  handleBlockUnblockUser(selectedUser) {
    const {
      user,
      blockUser,
      unblockUser,
    } = this.props;
    const activeUser = user.active;
    const isBlocked = selectedUser.blocked;

    if ( ! isBlocked ) {
      blockUser( activeUser._id, selectedUser._id );
    } else {
      unblockUser( activeUser._id, selectedUser._id );
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
      blockedUser,
      upload,
      uploadImage,
      children,
    } = this.props;
    const {
      editProfileModalOpen,
      blockedUsersListModalOpen,
    } = this.state;

    return (
      <Appbar className="header">
        <div className="content">
          {children}
        </div>
        {::this.handleVideoCamRender()}
        {::this.handleNewMessagesDropdownRender()}
        {::this.handleChatRoomDropdownRender()}
        <UserDropdown
          user={user.active}
          handleOpenEditProfileModal={::this.handleOpenEditProfileModal}
          handleOpenBlockedUsersListModal={::this.handleOpenBlockedUsersListModal}
        >
          {
            editProfileModalOpen &&
            <UserDropdown.EditProfileModal
              user={user.active}
              upload={upload}
              handleImageUpload={uploadImage}
              handleEditProfile={::this.handleEditProfile}
              userEdit={user.editActive}
              open={editProfileModalOpen}
              onClose={::this.handleCloseEditProfileModal}
            />
          }
          {
            blockedUsersListModalOpen &&
            <UserDropdown.BlockedUsersListModal
              handleFetchBlockedUsers={::this.handleFetchBlockedUsers}
              blockedUsers={blockedUser.all}
              blockedUserFetch={blockedUser.fetch}
              handleUnblockAllUsers={::this.handleUnblockAllUsers}
              blockedUserUnblockAll={blockedUser.unblockAll}
              handleBlockUnblockUser={::this.handleBlockUnblockUser}
              blockedUserBlock={blockedUser.block}
              blockedUserUnblock={blockedUser.unblock}
              open={blockedUsersListModalOpen}
              onClose={::this.handleCloseBlockedUsersListModal}
            />
          }
        </UserDropdown>
      </Appbar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom,
    blockedUser: state.blockedUser,
    upload: state.upload,
  }
}

Header.propTypes = {
  handleOpenPopUpChatRoom: PropTypes.func.isRequired,
  handleRequestVideoCall: PropTypes.func.isRequired,
  handleStartLiveVideo: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
