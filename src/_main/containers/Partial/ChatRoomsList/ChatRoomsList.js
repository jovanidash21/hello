import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
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
  componentDidUpdate(prevProps) {
    if ( prevProps.chatRoom.isFetching && !this.props.chatRoom.isFetching ) {
      const {
        user,
        chatRoom,
        changeChatRoom
      } = this.props;
      const allChatRooms = chatRoom.all.sort((a, b) => {
        var priority = a.priority - b.priority;
        var date = new Date(a.data.createdAt) - new Date(b.data.createdAt);

        if (priority !== 0) {
          return priority;
        } else {
          return date;
        }
      });

      changeChatRoom(allChatRooms[0], user.active._id, '');
    }
  }
  handleChatRoomsListRender(chatType) {
    const {
      user,
      chatRoom,
      changeChatRoom,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    if ( !chatRoom.isFetching && chatRoom.isFetchingSuccess ) {
      const activeChatRoom = chatRoom.active;

      return (
        <div className="chat-rooms-list">
          {
            chatType === 'direct' &&
            chatRoom.all.filter((singleChatRoom) =>
              singleChatRoom.data.chatType === 'private' ||
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
                isTrashingAChatRoom={chatRoom.isTrashing && chatRoom.isTrashingSuccess}
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
  handleOpenModal(event) {
    event.preventDefault();

    this.setState({isModalOpen: true});
  }
  handleCloseModal() {
    this.setState({isModalOpen: false});
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
            {::this.handleChatRoomsListRender('direct')}
          </div>
          <div className="chat-room-pane mui-tabs__pane mui--is-active" id="group-chat-rooms">
            <div className="chat-rooms-options">
              <h3>Group Messages</h3>
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
