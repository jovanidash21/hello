import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../actions';
import LoadingAnimation from '../../components/LoadingAnimation';
import ChatRoom from '../../components/LeftSideDrawer/ChatRoom';
import CreateChatRoomModal from './CreateChatRoomModal';
import '../../styles/LeftSideDrawer.scss';

class LeftSideDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'group',
      showModal: false
    }
  }
  componentWillMount() {
    const {
      user,
      fetchChatRooms
    } = this.props;

    fetchChatRooms(user.active._id);
  }
  handleChatRoomsListRender(chatType) {
    const {
      user,
      chatRoom,
      changeChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    if (!chatRoom.isLoading && chatRoom.isFetchChatRoomsSuccess) {
      const activeChatRoom = chatRoom.active;

      return (
        <div className="chat-room-list">
          {
            chatType === 'direct' &&
            chatRoom.all.filter((singleChatRoom) =>
              singleChatRoom.data.chatType === 'private' ||
              singleChatRoom.data.chatType === 'direct'
            ).map((singleChatRoom, i) =>
              <ChatRoom
                key={i}
                index={i}
                user={user.active}
                chatRoom={singleChatRoom}
                activeChatRoom={activeChatRoom}
                isActive={(activeChatRoom.data._id === singleChatRoom.data._id) ? true : false}
                handleChangeChatRoom={changeChatRoom}
                handleLeftSideDrawerToggleEvent={handleLeftSideDrawerToggleEvent}
              />
            )
          }
          {
            chatType === 'group' &&
            chatRoom.all.filter((singleChatRoom) =>
              singleChatRoom.data.chatType === 'public' ||
              singleChatRoom.data.chatType === 'group'
            ).sort((a, b) =>  {
              var n = a.priority - b.priority;

              if (n !== 0) {
                return n;
              }

              return a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
            }).map((singleChatRoom, i) =>
              <ChatRoom
                key={i}
                index={i}
                user={user.active}
                chatRoom={singleChatRoom}
                activeChatRoom={activeChatRoom}
                isActive={(activeChatRoom.data._id === singleChatRoom.data._id) ? true : false}
                handleChangeChatRoom={changeChatRoom}
                handleLeftSideDrawerToggleEvent={handleLeftSideDrawerToggleEvent}
              />
            )
          }
        </div>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="white" />
      )
    }
  }
  handleChangeTab(event, tab) {
    event.preventDefault();

    this.setState({activeTab: tab});
  }
  handleActivateModal() {
    this.setState({showModal: true});
  }
  handleDeactivateModal() {
    this.setState({showModal: false});
  }
  render() {
    const {
      user,
      chatRoom,
      isLeftSideDrawerOpen,
      handleLeftSideDrawerToggleEvent,
      handleLeftSideDrawerToggleState,
      noOverlay
    } = this.props;
    const {
      activeTab,
      showModal
    } = this.state;

    return (
      <Menu
        overlayClassName={"left-side-drawer-overlay"}
        width="250px"
        isOpen={isLeftSideDrawerOpen}
        onStateChange={handleLeftSideDrawerToggleState}
        noOverlay={noOverlay}
      >
        <div>
          <div className="left-side-drawer">
            <ul className="chat-room-tabs mui-tabs__bar">
              <li>
                <a data-mui-toggle="tab" data-mui-controls="direct-chat-rooms" onClick={(e) => ::this.handleChangeTab(e, 'direct')}>
                  Direct
                </a>
              </li>
              <li className="mui--is-active">
                <a data-mui-toggle="tab" data-mui-controls="group-chat-rooms" onClick={(e) => ::this.handleChangeTab(e, 'group')}>
                  Group
                </a>
              </li>
            </ul>
            <div className="chat-room-pane mui-tabs__pane" id="direct-chat-rooms">
              <div className="chat-rooms-options">
                <h3>Direct Messages</h3>
                {
                  (user.active.role === 'owner' ||
                  user.active.role === 'admin') &&
                  <div className="add-chat-room-icon"
                    onClick={::this.handleActivateModal}
                    title="Open a Direct Message"
                  >
                    <FontAwesome name="plus-circle" />
                  </div>
                }
              </div>
              {::this.handleChatRoomsListRender('direct')}
            </div>
            <div className="chat-room-pane mui-tabs__pane mui--is-active" id="group-chat-rooms">
              <div className="chat-rooms-options">
                <h3>Group Messages</h3>
                {
                  (user.active.role === 'owner' ||
                  user.active.role === 'admin') &&
                  <div className="add-chat-room-icon"
                    onClick={::this.handleActivateModal}
                    title="Add Chat Room"
                  >
                    <FontAwesome name="plus-circle" />
                  </div>
                }
              </div>
              {::this.handleChatRoomsListRender('group')}
            </div>
          </div>
          {
            showModal &&
            <CreateChatRoomModal
              chatType={activeTab}
              handleDeactivateModal={::this.handleDeactivateModal}
              handleLeftSideDrawerToggleEvent={handleLeftSideDrawerToggleEvent}
              isLoading={chatRoom.isLoading}
            />
          }
        </div>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

LeftSideDrawer.propTypes = {
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleState: PropTypes.func.isRequired,
  isLeftSideDrawerOpen: PropTypes.bool,
  noOverlay: PropTypes.bool
}

LeftSideDrawer.defaultProps = {
  isLeftSideDrawerOpen: false,
  noOverlay: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSideDrawer);
