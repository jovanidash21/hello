import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import './styles.scss';

class ActiveAdminMenu extends Component {
  constructor(props) {
    super(props);
  }
  handleLeftSideDrawerToggleEvent(event) {
    event.preventDefault();

    const { handleLeftSideDrawerToggleEvent } = this.props;

    handleLeftSideDrawerToggleEvent(true);
  }
  handleLogout() {
    const {
      user,
      logout
    } = this.props;

    logout(user.active._id);
  }
  render() {
    const {
      user,
      logout
    } = this.props;

    return (
      <div className="admin-title-wrapper">
        <MediaQuery query="(max-width: 767px)">
          <div
            className="hamburger-icon"
            onClick={::this.handleLeftSideDrawerToggleEvent}
          >
            <FontAwesome name="bars" size="2x" />
          </div>
        </MediaQuery>
        <h2 className="admin-title">

        </h2>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

ActiveAdminMenu.propTypes = {
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveAdminMenu);
