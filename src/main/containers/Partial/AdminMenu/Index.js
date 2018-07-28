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
    const { menuItems } = this.props;
    const { openMenuItem } = this.state;

    return (
      <div style={{height: '100%'}}>
        <div className="admin-menu-wrapper">
          <h1 className="title">Admin Panel</h1>
          <div className="menus-list">
            {
              menuItems.length > 0 &&
              menuItems.map((singleMenuItem, i) =>
                <MenuItem
                  key={i}
                  index={i}
                  icon={singleMenuItem.icon}
                  title={singleMenuItem.title}
                  isOpen={openMenuItem === i}
                  handleOpenMenuItem={::this.handleOpenMenuItem}
                >
                  {
                    singleMenuItem.subMenuItems.length > 0 &&
                    singleMenuItem.subMenuItems.map((singleSubMenuItem, i) =>
                      <SubMenuItem key={i} title={singleSubMenuItem.title} />
                    )
                  }
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
  menuItems: PropTypes.array.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminMenu);
