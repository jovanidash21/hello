import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class ChatRoomMember extends Component {
  constructor(props) {
    super(props);
  }
  handleOnlineIcon() {
    const { chatRoomMember } = this.props;

    return (
      <div className={"online-indicator " + (chatRoomMember.isOnline ? 'online' : '')}>
        <FontAwesome
          className="circle-icon"
          name={chatRoomMember.isOnline ? 'circle' : 'circle-thin'}
        />
      </div>
    )
  }
  handleRoleBadgeLogo() {
    const { chatRoomMember } = this.props;
    var icon = '';
    var title = '';

    switch ( chatRoomMember.role ) {
      case 'owner':
        icon = 'shield';
        title = 'This member is an owner';
        break;
      case 'admin':
        icon = 'font';
        title = 'This member is an admin';
        break;
      case 'moderator':
        icon = 'forward';
        title = 'This member is a moderator';
        break;
      default:
        return;
    }

    return (
      <div
        className={`badge-logo top ${chatRoomMember.role}`}
        title={title}
      >
        <FontAwesome
          className="social-icon"
          name={icon}
        />
      </div>
    )
  }
  handleAccountTypeBadgeLogo() {
    const { chatRoomMember } = this.props;
    var icon = '';

    switch ( chatRoomMember.accountType ) {
      case 'guest':
        icon = 'star';
        break;
      default:
        icon = chatRoomMember.accountType;
        break;
    }

    return (
      <div className={`badge-logo ${chatRoomMember.accountType}`}>
        <FontAwesome
          className="social-icon"
          name={icon}
        />
      </div>
    )
  }
  handleAddDirectChatRoom(event) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleAddDirectChatRoom
    } = this.props;

    handleAddDirectChatRoom(event, chatRoomMember._id);
  }
  handleKickMember(event) {
    event.preventDefault();

    const {
      activeChatRoom,
      chatRoomMember,
      handleKickMember
    } = this.props;

    handleKickMember(activeChatRoom._id, chatRoomMember._id);
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
      userData,
      chatRoomMember
    } = this.props;

    return (
      <div
        className={"chat-room-member " +
          ( chatRoomMember.role === 'vip' ? 'special ' : '' )
        }
        title={chatRoomMember.name}
      >
        {::this.handleOnlineIcon()}
        <div
          className="member-icon"
          style={{backgroundImage: `url(${chatRoomMember.profilePicture})`}}
        >
          {
            chatRoomMember.role !== 'ordinary' &&
            chatRoomMember.role !== 'vip' &&
            ::this.handleRoleBadgeLogo()
          }
          {
            chatRoomMember.accountType !== 'local' &&
            ::this.handleAccountTypeBadgeLogo()
          }
        </div>
        <div className="member-name">
          {chatRoomMember.name}
          {
            userData._id === chatRoomMember._id &&
            <span className="you-label">(you)</span>
          }
        </div>
        {
          chatRoomMember.isMute &&
          <div className="mute-logo" title="This member is muted">
            <FontAwesome
              className="eye-icon"
              name="eye"
            />
          </div>
        }
        {
          chatRoomMember.gender.length > 0 &&
          <div className="gender-logo" title={chatRoomMember.gender}>
            <FontAwesome
              className="gender-icon"
              name={chatRoomMember.gender}
            />
          </div>
        }
        <div className="member-options-button-wrapper">
          {
            userData._id !== chatRoomMember._id &&
            userData.accountType !== 'guest' &&
            <div>
              <div className="member-options-button" data-mui-toggle="dropdown">
                <FontAwesome
                  className="options-icon"
                   name="ellipsis-v"
                />
              </div>

              <ul className="mui-dropdown__menu mui-dropdown__menu--right">
                {
                  chatRoomMember.role !== 'vip' &&
                  <li>
                    <a href="#" onClick={::this.handleAddDirectChatRoom}>
                      Direct Messages
                    </a>
                  </li>
                }
                {
                  (
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ) &&
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
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ) &&
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
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ) &&
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
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ) &&
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
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ) &&
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
                    ( userData.role === 'owner' ||
                      userData.role === 'admin' ||
                      userData.role === 'moderator' ) &&
                    ( chatRoomMember.role !== 'owner' &&
                      chatRoomMember.accountType !== 'guest' ) &&
                      ! chatRoomMember.isMute
                  ) &&
                  <li>
                    <a href="#" onClick={::this.handleMuteMember}>Mute Member</a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    )
  }
}

ChatRoomMember.propTypes = {
  userData: PropTypes.object.isRequired,
  activeChatRoom: PropTypes.object.isRequired,
  chatRoomMember: PropTypes.object.isRequired,
  handleAddDirectChatRoom: PropTypes.func.isRequired,
  handleKickMember: PropTypes.func.isRequired,
  handleUpdateMemberRole: PropTypes.func.isRequired,
  handleMuteMember: PropTypes.func.isRequired
}

export default ChatRoomMember;
