import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import { Avatar } from '../../../components/Avatar';
import './styles.scss';

class OptionsDropdown extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { user } = this.props;

    return (
      <div className="mui-dropdown options-dropdown">
        <MediaQuery query="(min-width: 768px)">
          <div className="user-details">
            <Avatar
              image={user.profilePicture}
              name={user.name}
              role={user.role}
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
          <ul className="mui-dropdown__menu mui-dropdown__menu--right">
            <li>
              <a href="/logout">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

OptionsDropdown.propTypes = {
  user: PropTypes.object.isRequired
}

export default OptionsDropdown;
