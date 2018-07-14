import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../actions';
import Header from '../Common/Header';
import LeftSideDrawer from '../Common/LeftSideDrawer';
import ActiveAdminMenu from '../Partial/ActiveAdminMenu';
import AdminMenu from '../Partial/AdminMenu';
import Head from '../../components/Head';
import LoadingAnimation from '../../components/LoadingAnimation';
import '../../styles/Admin.scss';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeftSideDrawerOpen: false
    };
  }
  componentWillMount() {
    const {
      user,
      socketUserLogin
    } = this.props;

    socketUserLogin(user.active);
    document.body.className = '';
    document.body.classList.add('admin-page');
  }
  handleLeftSideDrawerRender() {
    const { isLeftSideDrawerOpen } = this.state;

    return (
      <MediaQuery query="(max-width: 767px)">
        {(matches) => {
          return (
            <LeftSideDrawer
              handleLeftSideDrawerToggleState={::this.handleLeftSideDrawerToggleState}
              isLeftSideDrawerOpen={matches ? isLeftSideDrawerOpen : true}
              noOverlay={matches ? false : true}
            >
              <AdminMenu handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent} />
            </LeftSideDrawer>
          )
        }}
      </MediaQuery>
    )
  }
  handleLeftSideDrawerToggleEvent(openTheDrawer: false) {
    this.setState({isLeftSideDrawerOpen: openTheDrawer});
  }
  handleLeftSideDrawerToggleState(state) {
    this.setState({isLeftSideDrawerOpen: state.isOpen});
  }
  render() {
    return (
      <div className="admin-section">
        <Head title="Chat App | Admin" />
        {::this.handleLeftSideDrawerRender()}
        <Header>
          <ActiveAdminMenu handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent} />
        </Header>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    typer: state.typer,
    chatRoom: state.chatRoom,
    message: state.message
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
