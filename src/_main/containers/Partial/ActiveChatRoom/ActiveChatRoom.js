import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { handleChatRoomAvatarBadges } from '../../../../utils/avatar';
import { isObjectEmpty } from '../../../../utils/object';
import { formatNumber } from '../../../../utils/number';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import { Avatar } from '../../../../components/Avatar';
import './styles.scss';

class ActiveChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  handleActiveChatRoomRender() {
    const {
      user,
      chatRoom,
      member
    } = this.props;

    if (
      !chatRoom.fetch.loading &&
      chatRoom.fetch.success &&
      !isObjectEmpty(chatRoom.active.data)
    ) {
      const activeChatRoom = chatRoom.active;

      return (
        <div className="chat-room-detail-wrapper">
          <Avatar
            image={activeChatRoom.data.chatIcon}
            size="32px"
            name={activeChatRoom.data.name}
            roleChatType={handleChatRoomAvatarBadges(activeChatRoom.data, user.active, 'role-chat')}
            accountType={handleChatRoomAvatarBadges(activeChatRoom.data, user.active)}
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
                !member.fetch.loading &&
                member.fetch.success &&
                <div
                  className="members-count"
                  onClick={::this.handleRightSideDrawerToggleEvent}
                  title="View Online Members List"
                >
                  <FontAwesome
                    className="user-icon"
                    name="user"
                  />
                  {formatNumber(member.all.length)}
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
