import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { formatNumber } from '../../../../utils/number';
import { isObjectEmpty } from '../../../../utils/object';
import { BlockUnblockUserModal } from '../BlockUnblockUserModal';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import { SearchFilter } from '../../../../components/SearchFilter';
import { ChatRoomMember } from '../../../components/RightSideDrawer';
import './styles.scss';

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      searchFilter: '',
      selectedMemberIndex: -1,
      blockUnblockUserModalOpen: false,
      selectedUser: {},
    }
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.member.fetch.loading && !this.props.member.fetch.loading ) {
      ::this.handleMembersListFilter();
    }

    if ( prevProps.member.all.length !== this.props.member.all.length ) {
      ::this.handleMembersListFilter(this.state.searchFilter);
    }

    if ( prevProps.chatRoom.create.loading && this.props.chatRoom.create.success ) {
      const { handleRightSideDrawerToggleEvent } = this.props;

      handleRightSideDrawerToggleEvent();
      this.setState({
        searchFilter: '',
        selectedMemberIndex: -1
      });
    }
  }
  handleMembersListFilter(searchFilter='') {
    const { member } = this.props;
    const { selectedMemberIndex } = this.state;
    var allMembers = [...member.all];
    var memberIndex = selectedMemberIndex;

    if ( searchFilter.length > 0 ) {
      allMembers = allMembers.filter((singleMember) => {
        return singleMember.name.toLowerCase().match(searchFilter.toLowerCase());
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
      selectedMemberIndex: memberIndex
    });
  }
  handleClearSearchFilter() {
    this.setState({searchFilter: ''});
    ::this.handleMembersListFilter();
  }
  handleMembersListRender() {
    const {
      user,
      chatRoom,
      member,
      handleRequestLiveVideo
    } = this.props;
    const {
      members,
      searchFilter,
      selectedMemberIndex
    } = this.state;
    const activeChatRoom = chatRoom.active;

    if ( !member.fetch.loading && member.fetch.success ) {
      return (
        <div className="members-list-wrapper">
          <div className="members-count">
            <FontAwesome
              className="user-icon"
              name="user"
              size="2x"
            />
            <h3>
              {formatNumber(member.all.length)}&nbsp;
              {activeChatRoom.data.chatType === 'public' ? 'Connected' : 'Online'}&nbsp;
              {member.all.length > 1 ? 'Members' : 'Member'}
            </h3>
          </div>
          <MediaQuery query="(max-width: 767px)">
            {(matches) => {
              return (
                <SearchFilter
                  value={searchFilter}
                  onChange={::this.onMemberNameChange}
                  onKeyDown={(e) => {::this.onMemberNameKeyDown(e, matches)}}
                  handleClearSearchFilter={::this.handleClearSearchFilter}
                  light
                />
              )
            }}
          </MediaQuery>
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
                  handleRequestLiveVideo={handleRequestLiveVideo}
                  handleAddDirectChatRoom={::this.handleAddDirectChatRoom}
                  handleOpenBlockUnblockUserModal={::this.handleOpenBlockUnblockUserModal}
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
    const searchFilter = event.target.value;

    this.setState({searchFilter: searchFilter});

    ::this.handleMembersListFilter(searchFilter);
  }
  onMemberNameKeyDown(event, mobile) {
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

        ::this.handleAddDirectChatRoom(selectedMember._id, mobile);
      }
    }
  }
  handleAddDirectChatRoom(memberID, mobile) {
    const {
      user,
      chatRoom,
      createDirectChatRoom,
      changeChatRoom,
      handleRightSideDrawerToggleEvent,
      handleOpenPopUpChatRoom
    } = this.props;
    const activeUser = user.active;
    const userID = activeUser._id;
    const chatRooms = chatRoom.all;
    const activeChatRoom = chatRoom.active;
    var chatRoomExists = false;
    var existingChatRoomData = {};

    for ( var i = 0; i < chatRooms.length; i++ ) {
      var singleChatRoom = chatRooms[i];

      if (
        userID === memberID ||
        ( singleChatRoom.data.chatType === 'direct' && singleChatRoom.data.members.some(member => member._id === memberID) )
      ) {
        chatRoomExists = true;
        existingChatRoomData = singleChatRoom;
        break;
      }
    }

    if ( !chatRoomExists ) {
      createDirectChatRoom(userID, memberID, activeChatRoom.data._id, activeUser.connectedChatRoom, !mobile)
        .then((chatRoom) => {
          if ( ! mobile ) {
            handleOpenPopUpChatRoom(chatRoom);
          }
        });
    } else if ( !isObjectEmpty(existingChatRoomData) ) {
      if ( mobile ) {
        changeChatRoom(existingChatRoomData, userID, activeChatRoom.data._id, user.connectedChatRoom);
      } else {
        handleOpenPopUpChatRoom(existingChatRoomData);
      }

      handleRightSideDrawerToggleEvent();
      ::this.handleMembersListFilter();
      this.setState({
        searchFilter: '',
        selectedMemberIndex: -1
      });
    } else {
      handleRightSideDrawerToggleEvent();
      ::this.handleMembersListFilter();
      this.setState({
        searchFilter: '',
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
  handleOpenBlockUnblockUserModal(selectedUser) {
    this.setState({
      blockUnblockUserModalOpen: true,
      selectedUser,
    });
  }
  handleCloseBlockUnblockUserModal() {
    this.setState({
      blockUnblockUserModalOpen: false,
      selectedUser: {},
    });
  }
  render() {
    const {
      isRightSideDrawerOpen,
      handleRightSideDrawerToggleState,
      noOverlay
    } = this.props;
    const {
      blockUnblockUserModalOpen,
      selectedUser,
    } = this.state;

    return (
      <div style={{height: '100%'}}>
        {::this.handleMembersListRender()}
        {
          blockUnblockUserModalOpen &&
          <BlockUnblockUserModal
            open={blockUnblockUserModalOpen}
            selectedUser={selectedUser}
            onClose={::this.handleCloseBlockUnblockUserModal}
          />
        }
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
  handleRightSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleOpenPopUpChatRoom: PropTypes.func.isRequired,
  handleRequestLiveVideo: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList);
