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

    this.state = {
      openMenuItem: -1
    };
  }
  handleOpenMenuItem(menuItemIndex) {
    const { openMenuItem } = this.state;

    if ( openMenuItem !== menuItemIndex ) {
      this.setState({openMenuItem: menuItemIndex});
    } else {
      this.setState({openMenuItem: -1});
    }
  }
  render() {
    const { openMenuItem } = this.state;
    const menuItems = [
      {
        icon: "user",
        title: "User"
      },
      {
        icon: "key",
        title: "Chat Room"
      }
    ];

    return (
      <div style={{height: '100%'}}>
        <div className="admin-menu-wrapper">
          <h1 className="title">Admin Panel</h1>
          <div className="menus-list">
            {
              menuItems.map((singleMenu, i) =>
                <MenuItem
                  key={i}
                  index={i}
                  icon={singleMenu.icon}
                  title={singleMenu.title}
                  isOpen={openMenuItem === i}
                  handleOpenMenuItem={::this.handleOpenMenuItem}
                >
                  <SubMenuItem title="Create" />
                  <SubMenuItem title="Edit" />
                  <SubMenuItem title="Delete" />
                </MenuItem>
              )
            }
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
