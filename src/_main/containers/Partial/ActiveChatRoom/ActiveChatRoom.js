import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import { Avatar } from '../../../../components/Avatar';
import './styles.scss';

class ActiveChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  handleAvatar(type) {
    const {
      user,
      chatRoom
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;
    var role = '';
    var accountType = '';

    switch ( activeChatRoom.data.chatType ) {
      case 'private':
        role = activeUser.role;
        accountType = activeUser.accountType;
        break;
      case 'direct':
        for ( var i = 0; i < activeChatRoom.data.members.length; i++ ) {
          var member = activeChatRoom.data.members[i];

          if ( member._id != activeUser._id ) {
            role = member.role;
            accountType = member.accountType;
            break;
          } else {
            continue;
          }
        }
        break;
      default:
        break;
    }

    if ( type === 'role' ) {
      return role;
    } else if ( type === 'accountType' ) {
      return accountType;
    }
    return accountType;
  }
  handleActiveChatRoomRender() {
    const {
      chatRoom,
      member
    } = this.props;

    if (
      !chatRoom.isFetching &&
      chatRoom.isFetchingSuccess &&
      Object.keys(chatRoom.active.data).length > 0
    ) {
      const activeChatRoom = chatRoom.active;

      return (
        <div className="chat-room-detail-wrapper">
          <Avatar
            image={activeChatRoom.data.chatIcon}
            size="32px"
            name={activeChatRoom.data.name}
            role={::this.handleAvatar('role')}
            accountType={::this.handleAvatar('accountType')}
            chatType={activeChatRoom.data.chatType}
            badgeCloser
          />
          <div className="chat-room-detail">
            <h2
              className="chat-room-name"
              title={activeChatRoom.data.name}
            >
              {activeChatRoom.data.name}
            </h2>
            <MediaQuery query="(max-width: 767px)">
              {
                !member.isFetching &&
                member.isFetchingSuccess &&
                <div
                  className="members-count"
                  onClick={::this.handleRightSideDrawerToggleEvent}
                  title="View Online Members List"
                >
                  <FontAwesome
                    className="user-icon"
                    name="user"
                  />
                  {member.all.length}
                </div>
              }
            </MediaQuery>
          </div>
        </div>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="white" />
      )
    }
  }
  handleLeftSideDrawerToggleEvent(event) {
    event.preventDefault();

    const { handleLeftSideDrawerToggleEvent } = this.props;

    handleLeftSideDrawerToggleEvent(true);
  }
  handleRightSideDrawerToggleEvent(event) {
    event.preventDefault();

    const { handleRightSideDrawerToggleEvent } = this.props;

    handleRightSideDrawerToggleEvent(true);
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
      <div className="active-chat-room">
        <FontAwesome
          className="hamburger-icon"
          name="bars"
          size="2x"
          onClick={::this.handleLeftSideDrawerToggleEvent}
        />
        {::this.handleActiveChatRoomRender()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom,
    member: state.member
  }
}

ActiveChatRoom.propTypes = {
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleRightSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveChatRoom);
