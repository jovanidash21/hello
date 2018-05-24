import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const {
      index,
      userData,
      chatRoomData,
      handleSocketJoinChatRoom,
      handleChangeChatRoom,
      handleFetchMessages
    } = this.props;

    if (index === 0) {
      const data = {
        userID: userData._id,
        chatRoomID: chatRoomData._id
      };

      handleSocketJoinChatRoom(chatRoomData._id);
      handleChangeChatRoom(chatRoomData);
      handleFetchMessages(data);
    }
  }
  handleAccountTypeBadgeLogo() {
    const {
      userData,
      chatRoomData
    } = this.props;

    switch ( chatRoomData.chatType ) {
      case 'private':
        var icon = '';

        switch ( userData.accountType ) {
          case 'guest':
            icon = 'star';
            break;
          default:
            icon = userData.accountType;
            break;
        }

        return (
          <div className={`badge-logo ${userData.accountType}`}>
            <FontAwesome
              className="social-icon"
              name={icon}
            />
          </div>
        )
        break;
      case 'direct':
        for ( var i = 0; i < chatRoomData.members.length; i++ ) {
          var member = chatRoomData.members[i];

          if ( member._id != userData._id ) {
            if ( member.accountType !== 'local' ) {
              var icon = '';

              switch ( member.accountType ) {
                case 'guest':
                  icon = 'star';
                  break;
                default:
                  icon = member.accountType;
                  break;
              }

              return (
                <div className={`badge-logo ${member.accountType}`}>
                  <FontAwesome
                    className="social-icon"
                    name={icon}
                  />
                </div>
              )
            }
            return;
          } else {
            continue;
          }
        }
        break;
      case 'group':
        return;
    }
  }
  handleChangeChatRoom(event) {
    event.preventDefault();

    const {
      userData,
      chatRoomData,
      activeChatRoomData,
      handleSocketJoinChatRoom,
      handleSocketLeaveChatRoom,
      handleChangeChatRoom,
      handleFetchMessages,
      handleLeftSideDrawerToggleEvent
    } = this.props;

    const data = {
      userID: userData._id,
      chatRoomID: chatRoomData._id
    };

    handleSocketJoinChatRoom(chatRoomData._id);
    handleSocketLeaveChatRoom(activeChatRoomData._id);
    handleChangeChatRoom(chatRoomData);
    handleFetchMessages(data);
    handleLeftSideDrawerToggleEvent(event);
  }
  render() {
    const {
      chatRoomData,
      isActive
    } = this.props;

    return (
      <div
        className={"chat-room " + (isActive ? 'active' : '')}
        onClick={::this.handleChangeChatRoom}
        title={chatRoomData.name}
      >
        <div className="chat-room-icon" style={{backgroundImage: `url(${chatRoomData.chatIcon})`}}>
          {::this.handleAccountTypeBadgeLogo()}
        </div>
        <div className="chat-room-name">
          {chatRoomData.name}
          {
            chatRoomData.chatType === 'private' &&
            <span className="you-label">(you)</span>
          }
        </div>
      </div>
    )
  }
}

ChatRoom.propTypes = {
  index: PropTypes.number.isRequired,
  userData: PropTypes.object.isRequired,
  chatRoomData: PropTypes.object.isRequired,
  activeChatRoomData: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  handleSocketJoinChatRoom: PropTypes.func.isRequired,
  handleSocketLeaveChatRoom: PropTypes.func.isRequired,
  handleChangeChatRoom: PropTypes.func.isRequired,
  handleFetchMessages: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

ChatRoom.defaultProps = {
  isActive: false
}

export default ChatRoom;
