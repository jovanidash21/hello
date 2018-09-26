import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import {
  ChatRoomMemberFilter,
  ChatRoomMember
} from '../../../components/RightSideDrawer';
import './styles.scss';

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      memberName: '',
      selectedMemberIndex: -1
    }
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.member.isFetching && !this.props.member.isFetching ) ||
      ( prevProps.member.all.length !== this.props.member.all.length )
    ) {
      this.setState({members: this.props.member.all});
    }

    if ( prevProps.chatRoom.isCreating && this.props.chatRoom.isCreatingSuccess ) {
      const { handleRightSideDrawerToggleEvent } = this.props;

      handleRightSideDrawerToggleEvent();
      this.setState({
        memberName: '',
        selectedMemberIndex: -1
      });
    }
  }
  handleMembersListRender() {
    const {
      user,
      member
    } = this.props;
    const {
      members,
      memberName,
      selectedMemberIndex
    } = this.state;

    if ( !member.isFetching && member.isFetchingSuccess ) {
      return (
        <div className="members-list-wrapper">
          <div className="members-count">
            <FontAwesome
              className="user-icon"
              name="user"
              size="2x"
            />
            <h3>
              {member.all.length}&nbsp;
              {member.all.length > 1 ? 'Online Members' : 'Online Member'}
            </h3>
          </div>
          <ChatRoomMemberFilter
            value={memberName}
            onMemberNameChange={::this.onMemberNameChange}
            onMemberNameKeyDown={::this.onMemberNameKeyDown}
          />
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
                  chatRoomMember={chatRoomMember}
                  handleAddDirectChatRoom={::this.handleAddDirectChatRoom}
                  handleBlockMember={::this.handleBlockMember}
                  handleKickMember={::this.handleKickMember}
                  handleUpdateMemberRole={::this.handleUpdateMemberRole}
                  handleMuteMember={::this.handleMuteMember}
                  isActive={selectedMemberIndex === i}
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
    const { member } = this.props;
    const {
      members,
      selectedMemberIndex
    } = this.state;
    var allMembers = [];
    var memberName = event.target.value
    var memberIndex = selectedMemberIndex;

    if ( memberName.length > 0 ) {
      allMembers = members.filter((singleMember) => {
        return singleMember.name.toLowerCase().match(memberName);
      });

      if ( selectedMemberIndex === -1 ) {
        memberIndex = 0;
      }
    } else {
      allMembers = [...member.all];
      memberIndex = -1;
    }

    this.setState({
      members: allMembers,
      memberName: memberName,
      selectedMemberIndex: memberIndex
    });
  }
  onMemberNameKeyDown(event) {
    const {
      members,
      selectedMemberIndex
    } = this.state;

    if ( members.length > 0 ) {
      if ( event.keyCode === 38 ) {
        if ( selectedMemberIndex === -1 ) {
          this.setState({selectedMemberIndex: members.length - 1});
        } else {
          this.setState({selectedMemberIndex: selectedMemberIndex - 1});
        }
      }

      if ( event.keyCode === 40 ) {
        if ( selectedMemberIndex === members.length - 1 ) {
          this.setState({selectedMemberIndex: -1});
        } else {
          this.setState({selectedMemberIndex: selectedMemberIndex + 1});
        }
      }

      if ( event.key === 'Enter' && selectedMemberIndex !== -1 ) {
        const selectedMember = members[selectedMemberIndex];

        ::this.handleAddDirectChatRoom(selectedMember._id);
      }
    }
  }
  handleAddDirectChatRoom(memberID) {
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
    var chatRoomExists = false;
    var existingChatRoomData = {};

    for ( var i = 0; i < chatRooms.length; i++ ) {
      var singleChatRoom = chatRooms[i];

      if (
        ( singleChatRoom.data.chatType === 'private' && userID === memberID ) ||
        ( singleChatRoom.data.chatType === 'direct' && singleChatRoom.data.members.some(member => member._id === memberID) )
      ) {
        chatRoomExists = true;
        existingChatRoomData = singleChatRoom;
        break;
      }
    }

    if ( !chatRoomExists ) {
      createDirectChatRoom(userID, memberID, activeChatRoom.data._id);
    } else if ( Object.keys(existingChatRoomData).length > 0 && existingChatRoomData.constructor === Object ) {
      changeChatRoom(existingChatRoomData, userID, activeChatRoom.data._id);
      handleRightSideDrawerToggleEvent();
      this.setState({
        memberName: '',
        selectedMemberIndex: -1
      });
    } else {
      handleRightSideDrawerToggleEvent();
      this.setState({
        memberName: '',
        selectedMemberIndex: -1
      });
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
  handleKickMember(memberID) {
    const {
      user,
      chatRoom,
      kickMember
    } = this.props;
    const userData = user.active;
    const activeChatRoom = chatRoom.active;

    if ( userData.role === 'owner' || userData.role === 'admin' ) {
      kickMember(activeChatRoom.data._id, memberID);
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
