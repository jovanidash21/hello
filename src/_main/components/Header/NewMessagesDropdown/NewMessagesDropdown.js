import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { ChatRoom } from './ChatRoom';
import { NotificationCount } from '../../../../components/NotificationCount';
import './styles.scss';

const NewMessagesDropdown = (props) => {
  return (
    <div className="mui-dropdown new-messages-dropdown-wrapper">
      <div className="dropdown-toggle new-messages-dropdown" data-mui-toggle="dropdown">
        <div className="message-icon">
          <FontAwesome name="comment" />
        </div>
        {
          props.count > 0 &&
          <NotificationCount count={props.count} small />
        }
      </div>
      <ul className="dropdown-menu has-pointer mui-dropdown__menu mui-dropdown__menu--right">
        <div className="dropdown-chat-rooms-list">
          {
            props.count > 0
              ?
              props.children
              :
              <div className="no-new-messages">
                No New Messages
              </div>
          }
        </div>
      </ul>
    </div>
  )
}

NewMessagesDropdown.propTypes = {
  count: PropTypes.number
}

NewMessagesDropdown.defaultProps = {
  count: 0
}

NewMessagesDropdown.ChatRoom = ChatRoom;

export default NewMessagesDropdown;
