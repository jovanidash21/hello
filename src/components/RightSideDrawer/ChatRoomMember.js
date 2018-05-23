import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class ChatRoomMember extends Component {
  constructor(props) {
    super(props);
  }
  handleAddDirectChatRoom(event) {
    event.preventDefault();

    const {
      chatRoomMember,
      handleAddDirectChatRoom
    } = this.props;

    handleAddDirectChatRoom(event, chatRoomMember._id);
  }
  render() {
    const {
      userData,
      chatRoomMember
    } = this.props;

    return (
      <div className="chat-room-member" title={chatRoomMember.name}>
        <div
          className="member-icon"
          style={{backgroundImage: `url(${chatRoomMember.profilePicture})`}}
        />
        <div className="member-name">
          {chatRoomMember.name}
        </div>
        {
          userData._id !== chatRoomMember._id &&
          <div>
            <div className="member-options-button" data-mui-toggle="dropdown">
              <FontAwesome
                className="options-icon"
                 name="ellipsis-v"
              />
            </div>
            <ul className="mui-dropdown__menu mui-dropdown__menu--right">
              <li>
                <a href="#" onClick={::this.handleAddDirectChatRoom}>
                  Direct Messages
                </a>
              </li>
              {/*
                (
                  ( userData.role === 'owner' ||
                    userData.role === 'admin' ) &&
                  ( chatRoomMember.role !== 'owner' &&
                    chatRoomMember.role !== 'admin' )
                ) &&
                <li>
                  <a href="#">Make Admin</a>
                </li>
                <li>
                  <a href="#">Ban Member</a>
                </li>
                <li>
                  <a href="#">Kick Member</a>
                </li>
                <li>
                  <a href="#">Mute Member</a>
                </li>
                <li>
                  <a href="#">Make VIP</a>
                </li>
              */}
            </ul>
          </div>
        }
      </div>
    )
  }
}

ChatRoomMember.propTypes = {
  userData: PropTypes.object.isRequired,
  chatRoomMember: PropTypes.object.isRequired,
  handleAddDirectChatRoom: PropTypes.func.isRequired
}

export default ChatRoomMember;
