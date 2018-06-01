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
  handleMembersListRender() {
    const {
      user,
      chatRoom,
      member
    } = this.props;
    const { memberName } = this.state;

    if ( !member.isLoading && member.isFetchMembersSuccess ) {
      const activeChatRoom = chatRoom.active;
      var members = [...member.all];
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
                  handleBlockMember={::this.handleBlockMember}
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
      changeChatRoom,
      handleRightSideDrawerToggleEvent
    } = this.props;
    const userID = user.active._id;
    const chatRooms = chatRoom.all;
    const activeChatRoom = chatRoom.active;
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
      changeChatRoom(directChatRoomData, userID, activeChatRoom._id);
      handleRightSideDrawerToggleEvent(event);
    }
  }
  handleBlockMember(memberID) {
    const {
      user,
      blockMember
    } = this.props;
    const userData = user.active;

    if ( userData.role === 'owner' || userData.role === 'admin' ) {
      blockMember(memberID);
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
        <div className="right-side-drawer-wrapper">
          {::this.handleMembersListRender()}
        </div>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom,
    member: state.member
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
