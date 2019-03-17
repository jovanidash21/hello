import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import { Avatar } from '../Avatar';
import { EditProfileModal } from './EditProfileModal';
import './styles.scss';

class UserDropdown extends Component {
  constructor(props) {
    super(props);
  }
  handleOpenEditProfileModal(event) {
    event.preventDefault();

    const { handleOpenEditProfileModal } = this.props;

    handleOpenEditProfileModal();
  }
  render() {
    const {
      user,
      children
    } = this.props;
    const isLocalUser = user.accountType === 'local';
    const isGuestUser = user.accountType === 'guest';

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
        <React.Fragment>
          <button className="mui-btn mui-btn--small mui-btn--fab" data-mui-toggle="dropdown">
            <FontAwesome className="icon" name="ellipsis-v" size="2x" />
          </button>
          <ul className="dropdown-menu mui-dropdown__menu mui-dropdown__menu--right">
            <li>
              <a href="#" onClick={::this.handleOpenEditProfileModal}>
                <div className="option-icon">
                  <FontAwesome name={(isLocalUser || isGuestUser) ? 'edit' : 'user'} />
                </div>
                {(isLocalUser || isGuestUser) ? 'Edit ' : 'View '}profile
              </a>
            </li>
            <li>
              <a href="/logout">
                <div className="option-icon">
                  <FontAwesome name="sign-out" />
                </div>
                Logout
              </a>
            </li>
          </ul>
          {children}
        </React.Fragment>
      </div>
    )
  }
}

UserDropdown.EditProfileModal = EditProfileModal;

UserDropdown.propTypes = {
  user: PropTypes.object.isRequired,
  handleOpenEditProfileModal: PropTypes.func.isRequired
}

export default UserDropdown;
