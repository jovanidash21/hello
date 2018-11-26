import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Button } from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { ChatRoom } from '../../../components/LeftSideDrawer';
import { CreateChatRoomModal } from '../CreateChatRoomModal';
import './styles.scss';

class ChatRoomsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'group',
      isModalOpen: false
    }
  }
  handleChatRoomsListRender(chatType) {
    const {
      user,
      chatRoom,
      changeChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const activeChatRoom = chatRoom.active;

    return (
      <div className="chat-rooms-list">
        {
          chatType === 'direct' &&
          chatRoom.all.filter((singleChatRoom) =>
            singleChatRoom.data.chatType === 'direct'
          ).sort((a, b) =>  {
            var n = a.priority - b.priority;

            if (n !== 0) {
              return n;
            }

            return new Date(a.data.createdAt) - new Date(b.data.createdAt);
          }).map((singleChatRoom, i) =>
            <ChatRoom
              key={i}
              user={user.active}
              chatRoom={singleChatRoom}
              activeChatRoom={activeChatRoom}
              isActive={(activeChatRoom.data._id === singleChatRoom.data._id) ? true : false}
              handleChangeChatRoom={changeChatRoom}
              handleLeftSideDrawerToggleEvent={handleLeftSideDrawerToggleEvent}
              handleTrashChatRoom={::this.handleTrashChatRoom}
              isTrashing={chatRoom.trashAll.loading || (chatRoom.trash.loading && chatRoom.trash.chatRoomID === singleChatRoom.data._id)}
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

            return new Date(a.data.createdAt) - new Date(b.data.createdAt);
          }).map((singleChatRoom, i) =>
            <ChatRoom
              key={i}
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
  }
  handleChangeTab(event, tab) {
    event.preventDefault();

    this.setState({activeTab: tab});
  }
  handleOpenModal(event) {
    event.preventDefault();

    this.setState({isModalOpen: true});
  }
  handleCloseModal() {
    this.setState({isModalOpen: false});
  }
  handleTrashAllChatRooms(chatRoomID) {
    const {
      user,
      chatRoom,
      trashAllChatRooms
    } = this.props;
    const directChatRooms = chatRoom.all.filter((singleChatRoom) =>
      singleChatRoom.data.chatType === 'direct'
    );

    if ( directChatRooms.length > 0 ) {
      trashAllChatRooms(user.active._id);
    }
  }
  handleTrashChatRoom(chatRoomID) {
    const {
      user,
      trashChatRoom
    } = this.props;

    trashChatRoom(user.active._id, chatRoomID);
  }
  render() {
    const {
      user,
      chatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const {
      activeTab,
      isModalOpen
    } = this.state;

    return (
      <div style={{height: '100%'}}>
        <div className="chat-rooms-list-wrapper">
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
                  onClick={::this.handleOpenModal}
                  title="Open a Direct Message"
                >
                  <FontAwesome name="plus-circle" />
                </div>
              }
            </div>
            <div className="clear-all-button-wrapper">
              <Button
                className="button"
                color="danger"
                size="small"
                title="Clear All Chat Rooms"
                disabled={chatRoom.trashAll.loading}
                onClick={::this.handleTrashAllChatRooms}
              >
                <div className="trash-icon" >
                  <FontAwesome name="trash" />
                </div>
                Clear All
              </Button>
            </div>
            {::this.handleChatRoomsListRender('direct')}
          </div>
          <div className="chat-room-pane mui-tabs__pane mui--is-active" id="group-chat-rooms">
            <div className="chat-rooms-options">
              <h3>Room Messages</h3>
              {
                (user.active.role === 'owner' ||
                user.active.role === 'admin') &&
                <div className="add-chat-room-icon"
                  onClick={::this.handleOpenModal}
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
          isModalOpen &&
          <CreateChatRoomModal
            isModalOpen={isModalOpen}
            handleCloseModal={::this.handleCloseModal}
            chatType={activeTab}
            handleLeftSideDrawerToggleEvent={handleLeftSideDrawerToggleEvent}
          />
        }
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

ChatRoomsList.propTypes = {
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoomsList);
