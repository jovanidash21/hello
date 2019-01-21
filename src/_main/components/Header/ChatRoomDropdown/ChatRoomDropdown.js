import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

class ChatRoomDropdown extends Component {
  constructor(props) {
    super(props);
  }
  handleOpenLiveVideo(event) {
    event.preventDefault();

    const { handleOpenLiveVideo } = this.props;

    handleOpenLiveVideo();
  }
  render() {
    return (
      <div className="mui-dropdown chat-room-dropdown">
        <div className="dropdown-toggle settings-icon header-item-icon" data-mui-toggle="dropdown">
          <FontAwesome name="cog" />
        </div>
        <ul className="dropdown-menu has-pointer mui-dropdown__menu mui-dropdown__menu--right">
          <li>
            <a href="#" onClick={::this.handleOpenLiveVideo}>
              <div className="option-icon">
                <FontAwesome name="television" />
              </div>
              Live Video
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

ChatRoomDropdown.propTypes = {
  activeUser: PropTypes.object.isRequired,
  handleOpenLiveVideo: PropTypes.func.isRequired
}

export default ChatRoomDropdown;
