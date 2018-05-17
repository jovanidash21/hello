import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

const ChatRoomMember = (props) => {
  return (
    <div className="chat-room-member" title={props.chatRoomMember.name}>
      <div
        className="member-icon"
        style={{backgroundImage: `url(${props.chatRoomMember.profilePicture})`}}
      />
      <div className="member-name">
        {props.chatRoomMember.name}
      </div>
      <div className="member-options-button" data-mui-toggle="dropdown">
        <FontAwesome
          className="options-icon"
           name="ellipsis-v"
        />
      </div>
      <ul className="mui-dropdown__menu mui-dropdown__menu--right">
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
      </ul>
    </div>
  )
}

ChatRoomMember.propTypes = {
  chatRoomMember: PropTypes.object.isRequired
}

export default ChatRoomMember;
