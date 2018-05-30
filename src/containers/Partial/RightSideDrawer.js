import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../actions';
import LoadingAnimation from '../../components/LoadingAnimation';
import ChatRoomMemberFilter from '../../components/RightSideDrawer/ChatRoomMemberFilter';
import ChatRoomMember from '../../components/RightSideDrawer/ChatRoomMember';
import '../../styles/RightSideDrawer.scss';

class RightSideDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      memberName: ''
    }
  }
  handleComponent() {
    const {
      user,
      chatRoom
    } = this.props;
    const { memberName } = this.state;

    if ( !chatRoom.isLoading && chatRoom.isFetchChatRoomsSuccess ) {
      const activeChatRoom = chatRoom.active;
      var members = [...activeChatRoom.members];
      var query = memberName.trim().toLowerCase();

      if ( query.length > 0 ) {
        members = members.filter((member) => {
          return member.name.toLowerCase().match(query);
        });
      }

      return (
        <div className="right-side-drawer">
          <div className="members-count">
            <FontAwesome
              className="user-icon"
              name="user"
              size="2x"
            />
            <h3>
              Online Members
            </h3>
          </div>
          <ChatRoomMemberFilter onMemberNameChange={::this.onMemberNameChange} />
          <div className="member-list">
            {
              members.length > 0 &&
              members.filter((member) =>
                member.isOnline
              ).sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ).map((chatRoomMember, i) =>
                <ChatRoomMember
                  key={i}
                  userData={user.active}
                  activeChatRoom={activeChatRoom}
                  chatRoomMember={chatRoomMember}
                  handleAddDirectChatRoom={::this.handleAddDirectChatRoom}
                  handleKickMember={::this.handleKickMember}
                  handleUpdateMemberRole={::this.handleUpdateMemberRole}
                  handleMuteMember={::this.handleMuteMember}
                />
              )
            }
          </div>
        </div>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="white" />
      )
    }
  }
  onMemberNameChange(event) {
    this.setState({memberName: event.target.value});
  }
  handleAddDirectChatRoom(event, memberID) {
    const {
      user,
      chatRoom,
      createDirectChatRoom,
      socketJoinChatRoom,
      changeChatRoom,
      fetchMessages,
      handleRightSideDrawerToggleEvent
    } = this.props;
    const userID = user.active._id;
    const chatRooms = chatRoom.all;
    var directChatRoomExists = false;
    var directChatRoomData = {};

    for ( var i = 0; i < chatRooms.length; i++ ) {
      if ( chatRooms[i].chatType === 'direct' ) {
        var isMembersMatch = chatRooms[i].members.some(member => member._id === memberID);

        if ( isMembersMatch ) {
          directChatRoomExists = true;
          directChatRoomData = chatRooms[i];
          break;
        } else {
          continue;
        }
      } else {
        continue;
      }
    }

    if ( ! directChatRoomExists ) {
      createDirectChatRoom(userID, memberID);
      handleRightSideDrawerToggleEvent(event);
    } else {
      socketJoinChatRoom(directChatRoomData._id);
      changeChatRoom(directChatRoomData);
      fetchMessages(userID, directChatRoomData._id);
      handleRightSideDrawerToggleEvent(event);
    }
  }
  handleKickMember(chatRoomID, memberID) {
    const {
      user,
      kickMember
    } = this.props;
    const userData = user.active;

    if ( userData.role === 'owner' || userData.role === 'admin' ) {
      kickMember(chatRoomID, memberID);
    }
  }
  handleUpdateMemberRole(memberID, role) {
    const {
      user,
      updateMemberRole
    } = this.props;
    const userData = user.active;

    if ( userData.role === 'owner' || userData.role === 'admin' ) {
      updateMemberRole(memberID, role);
    }
  }
  handleMuteMember(memberID) {
    const {
      user,
      muteMember
    } = this.props;
    const userData = user.active;

    if ( userData.role === 'owner' || userData.role === 'admin' ) {
      muteMember(memberID);
    }
  }
  render() {
    const {
      isRightSideDrawerOpen,
      handleRightSideDrawerToggleState,
      noOverlay
    } = this.props;
    const { showModal } = this.state;

    return (
      <Menu
        overlayClassName="right-side-drawer-overlay"
        width="250px"
        isOpen={isRightSideDrawerOpen}
        onStateChange={handleRightSideDrawerToggleState}
        noOverlay={noOverlay}
        right
      >
        <div>
          {::this.handleComponent()}
        </div>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

RightSideDrawer.propTypes = {
  handleRightSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleRightSideDrawerToggleState: PropTypes.func.isRequired,
  isRightSideDrawerOpen: PropTypes.bool,
  noOverlay: PropTypes.bool
}

RightSideDrawer.defaultProps = {
  isRightSideDrawerOpen: false,
  noOverlay: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSideDrawer);
