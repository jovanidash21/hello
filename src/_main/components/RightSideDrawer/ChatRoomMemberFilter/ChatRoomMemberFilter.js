import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'muicss/react';
import './styles.scss';

const ChatRoomMemberFilter = (props) => {
  return (
    <div className="chat-room-member-filter">
      <Input
        value={props.value}
        type="text"
        autoComplete="off"
        floatingLabel={false}
        placeholder="Search"
        onChange={props.onMemberNameChange}
        onKeyDown={props.onMemberNameKeyDown}
      />
    </div>
  );
}

ChatRoomMemberFilter.propTypes = {
  value: PropTypes.string,
  onMemberNameChange: PropTypes.func.isRequired,
  onMemberNameKeyDown: PropTypes.func.isRequired
}

ChatRoomMemberFilter.defaultProps = {
  value: ''
}

export default ChatRoomMemberFilter;
