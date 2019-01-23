import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import ReactSVG from 'react-svg';
import { Avatar } from '../../../components/Avatar';
import './styles.scss';

class ChatRoomMember extends Component {
  constructor(props) {
    super(props);
  }
  handleAddDirectChatRoom(event, mobile) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleAddDirectChatRoom
    } = this.props;

    handleAddDirectChatRoom(chatRoomMember._id, mobile);
  }
  handleRequestLiveVideo(event) {
    event.preventDefault();

    const { handleRequestLiveVideo } = this.props;

    handleRequestLiveVideo(chatRoomMember);
  }
  handleBlockMember(event) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleBlockMember
    } = this.props;

    handleBlockMember(chatRoomMember._id);
  }
  handleKickMember(event) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleKickMember
    } = this.props;

    handleKickMember(chatRoomMember._id);
  }
  handleUpdateMemberRole(event, role) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleUpdateMemberRole
    } = this.props;

    handleUpdateMemberRole(chatRoomMember._id, role);
  }
  handleMuteMember(event) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleMuteMember
    } = this.props;

    handleMuteMember(chatRoomMember._id);
  }
  render() {
    const {
      user,
      chatRoomMember,
      isActive
    } = this.props;
    var isShowDropdownMenu = false;
    var chatRoomMemberOptions = {};

    if (
      user._id !== chatRoomMember._id &&
      (
        user.role !== 'ordinary' ||
        chatRoomMember.role !== 'vip'
      )
    ) {
      isShowDropdownMenu = true;
    }

    if ( isShowDropdownMenu ) {
      chatRoomMemberOptions = {
        'data-mui-toggle': "dropdown"
      }
    }

    return (
      <div
        className={"chat-room-member-wrapper " +
          (chatRoomMember.role === 'vip' ? 'special ' : ' ' ) +
          (isActive ? 'active' : '')
        }
        title={chatRoomMember.name}
      >
        <div className="chat-room-member" {...chatRoomMemberOptions}>
          <div className={"online-indicator " + (chatRoomMember.isOnline ? 'online' : '')}>
            <FontAwesome
              className="circle-icon"
              name={chatRoomMember.isOnline ? 'circle' : 'circle-thin'}
            />
          </div>
          <Avatar
            image={chatRoomMember.profilePicture}
            size="23px"
            name={chatRoomMember.name}
            roleChatType={chatRoomMember.role}
            accountType={chatRoomMember.accountType}
          />
          <div className="member-name">
            {chatRoomMember.name}
            {
              user._id === chatRoomMember._id &&
              <span className="you-label">(you)</span>
            }
          </div>
          {
            chatRoomMember.mute.data &&
            <div className="mute-icon" title="This member is muted">
              <FontAwesome name="eye" />
            </div>
          }
          {
            user._id !== chatRoomMember._id &&
            chatRoomMember.isLiveVideoActive &&
            <div className="live-video-icon" title="This member has live video">
              <FontAwesome name="television" />
            </div>
          }
          {
            chatRoomMember.gender.length > 0 &&
            <div className="gender-icon" title={chatRoomMember.gender}>
              <ReactSVG src={'../images/' + chatRoomMember.gender + '.svg'} />
            </div>
          }
        </div>
        {
          isShowDropdownMenu &&
          <ul className="dropdown-menu mui-dropdown__menu mui-dropdown__menu--right">
            {
              (
                user.role === 'owner' ||
                user.role === 'admin' ||
                chatRoomMember.role !== 'vip'
              ) &&
              <MediaQuery query="(max-width: 767px)">
                {(matches) => {
                  return (
                    <li>
                      <a href="#" onClick={(e) => {::this.handleAddDirectChatRoom(e, matches)}}>
                        Direct Messages
                      </a>
                    </li>
                  )
                }}
              </MediaQuery>
            }
            {
              ( user.role === 'owner' ||
                user.role === 'admin' ) &&
              chatRoomMember.ipAddress !== null &&
              chatRoomMember.ipAddress.length > 0  &&
              <li className="member-api-address">
                <small>IP Address</small>
                {chatRoomMember.ipAddress}
              </li>
            }
            {/*
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'admin' )
              ) &&
              <li>
                <a href="#" onClick={::this.handleBlockMember}>
                  Block Member
                </a>
              </li>
            */}
            {
              user._id !== chatRoomMember._id &&
              chatRoomMember.isLiveVideoActive &&
              <li>
                <a href="#" onClick={::this.handleRequestLiveVideo}>
                  View Live Video
                </a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'admin' )
              ) &&
              <li>
                <a href="#" onClick={::this.handleKickMember}>
                  Kick Member
                </a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'admin' ) &&
                ( chatRoomMember.accountType !== 'guest' )
              ) &&
              <li>
                <a href="#" onClick={(e) => ::this.handleUpdateMemberRole(e, 'admin')}>Make Admin</a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'moderator' ) &&
                ( chatRoomMember.accountType !== 'guest' )
              ) &&
              <li>
                <a href="#" onClick={(e) => ::this.handleUpdateMemberRole(e, 'moderator')}>Make Moderator</a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'vip' ) &&
                ( chatRoomMember.accountType !== 'guest' )
              ) &&
              <li>
                <a href="#" onClick={(e) => ::this.handleUpdateMemberRole(e, 'vip')}>Make VIP</a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.role !== 'ordinary' ) &&
                ( chatRoomMember.accountType !== 'guest' )
              ) &&
              <li>
                <a href="#" onClick={(e) => ::this.handleUpdateMemberRole(e, 'ordinary')}>
                  {chatRoomMember.role === 'admin' && 'Remove Admin'}
                  {chatRoomMember.role === 'moderator' && 'Remove Moderator'}
                  {chatRoomMember.role === 'vip' && 'Remove VIP'}
                </a>
              </li>
            }
            {
              (
                ( user.role === 'owner' ||
                  user.role === 'admin' ||
                  user.role === 'moderator' ) &&
                ( chatRoomMember.role !== 'owner' &&
                  chatRoomMember.accountType !== 'guest' ) &&
                  ! chatRoomMember.mute.data
              ) &&
              <li>
                <a href="#" onClick={::this.handleMuteMember}>Mute Member</a>
              </li>
            }
          </ul>
        }
      </div>
    )
  }
}

ChatRoomMember.propTypes = {
  user: PropTypes.object.isRequired,
  chatRoomMember: PropTypes.object.isRequired,
  handleRequestLiveVideo: PropTypes.func.isRequired,
  handleAddDirectChatRoom: PropTypes.func.isRequired,
  handleBlockMember: PropTypes.func.isRequired,
  handleKickMember: PropTypes.func.isRequired,
  handleUpdateMemberRole: PropTypes.func.isRequired,
  handleMuteMember: PropTypes.func.isRequired,
  isActive: PropTypes.bool
}

ChatRoomMember.defaultProps = {
  isActive: false
}

export default ChatRoomMember;
