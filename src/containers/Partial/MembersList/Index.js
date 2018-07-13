import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import LoadingAnimation from '../../../components/LoadingAnimation';
import ChatRoomMemberFilter from '../../../components/RightSideDrawer/ChatRoomMemberFilter';
import ChatRoomMember from '../../../components/RightSideDrawer/ChatRoomMember';
import './styles.scss';

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberName: ''
    }
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.chatRoom.isCreating && this.props.chatRoom.isCreatingSuccess ) {
      const { handleRightSideDrawerToggleEvent } = this.props;

      handleRightSideDrawerToggleEvent();
    }
  }
  handleMembersListRender() {
    const {
      user,
      chatRoom,
      member
    } = this.props;
    const { memberName } = this.state;

    if ( !member.isFetching && member.isFetchingSuccess ) {
      const activeChatRoom = chatRoom.active;
      var members = [...member.all];
      var query = memberName.trim().toLowerCase();

      if ( query.length > 0 ) {
        members = members.filter((singleMember) => {
          return singleMember.name.toLowerCase().match(query);
        });
      }

      return (
        <div className="members-list-wrapper">
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
          <div className="members-list">
            {
              members.length > 0 &&
              members.sort((a, b) => {
                var priority = a.priority - b.priority;
                var name = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                var date = new Date(b.createdAt) - new Date(a.createdAt);

                if (priority !== 0) {
                  return priority;
                } else if ( name !== 0 ) {
                  return name;
                } else {
                  return date;
                }
              }).map((chatRoomMember, i) =>
                <ChatRoomMember
                  key={i}
                  user={user.active}
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
    event.preventDefault();

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
      if ( chatRooms[i].data.chatType === 'direct' ) {
        var isMembersMatch = chatRooms[i].data.members.some(member => member._id === memberID);

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
      createDirectChatRoom(userID, memberID, activeChatRoom.data._id);
    } else {
      changeChatRoom(directChatRoomData, userID, activeChatRoom.data._id);
      handleRightSideDrawerToggleEvent();
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

    return (
      <div style={{height: '100%'}}>
        {::this.handleMembersListRender()}
      </div>
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

MembersList.propTypes = {
  handleRightSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList);
