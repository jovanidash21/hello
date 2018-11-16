import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import { Avatar } from '../Avatar';
import './styles.scss';

class UserDropdown extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { user } = this.props;

    return (
      <div className="mui-dropdown user-dropdown">
        <MediaQuery query="(min-width: 768px)">
          <div className="user-details">
            <Avatar
              image={user.profilePicture}
              name={user.name}
              roleChatType={user.role}
              accountType={user.accountType}
            />
            <div className="user-name">
              {user.name}
            </div>
          </div>
        </MediaQuery>
        <div>
          <button className="mui-btn mui-btn--small mui-btn--fab" data-mui-toggle="dropdown">
            <FontAwesome className="icon" name="ellipsis-v" size="2x" />
          </button>
          <ul className="dropdown-menu mui-dropdown__menu mui-dropdown__menu--right">
            <li>
              <a href="/logout">
                <div className="option-icon">
                  <FontAwesome name="sign-out" />
                </div>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

UserDropdown.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserDropdown;
