import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../../actions';
import MenuItem from '../../../components/LeftSideDrawer/MenuItem';
import './styles.scss';

var SubMenuItem = MenuItem.SubMenuItem;

class AdminMenu extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{height: '100%'}}>
        <div className="admin-menu-wrapper">
          <h1 className="title">Admin Panel</h1>
          <div className="menus-list">
            <MenuItem icon="user" title="User">
              <SubMenuItem title="Create" />
              <SubMenuItem title="Edit" />
              <SubMenuItem title="Delete" />
            </MenuItem>
            <MenuItem icon="key" title="Chat Room">
              <SubMenuItem title="Create" />
              <SubMenuItem title="Edit" />
              <SubMenuItem title="Delete" />
            </MenuItem>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

AdminMenu.propTypes = {
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminMenu);
