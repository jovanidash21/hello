import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import mapDispatchToProps from '../../../actions';
import { handleChatRoomAvatarBadges } from '../../../../utils/avatar';
import { isDirectChatRoomMemberOnline } from '../../../../utils/member';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import { Avatar } from '../../../../components/Avatar';
import { ChatBox } from '../ChatBox';
import {
  ChatInput,
  ChatAudioRecorder
} from '../../../components/Chat';
import './styles.scss';

class ChatPopUpWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAudioRecorderOpen: false
    };
  }
  handleActiveChatPopUpWindow(event) {
    event.preventDefault();

    const {
      index,
      handleActiveChatPopUpWindow
    } = this.props;

    handleActiveChatPopUpWindow(index);
  }
  handleAudioRecorderToggle(event) {
    event.preventDefault();

    this.setState({isAudioRecorderOpen: !this.state.isAudioRecorderOpen});
  }
  handleRequestVideoCall(event) {
    event.preventDefault();

    if ( event.stopPropagation ) {
      event.stopPropagation();
    }

    const {
      popUpChatRoom,
      handleRequestVideoCall
    } = this.props;

    if ( popUpChatRoom.data.chatType === 'direct' ) {
      handleRequestVideoCall(popUpChatRoom);
    }
  }
  handleClosePopUpChatRoom(event) {
    event.preventDefault();

    const {
      popUpChatRoom,
      closePopUpChatRoom
    } = this.props;

    closePopUpChatRoom(popUpChatRoom.data._id);
  }
  render() {
    const {
      user,
      popUpChatRoom,
      index,
      handleSendTextMessage,
      handleSendFileMessage,
      handleSendImageMessage,
      handleSendAudioMessage,
      active
    } = this.props;
    const { isAudioRecorderOpen } = this.state;
    const activeUser = user.active;
    const isChatInputDisabled = popUpChatRoom.message.fetchNew.loading;

    return (
      <Draggable bounds="parent" handle=".popup-header" onDrag={::this.handleActiveChatPopUpWindow}>
        <div
          className={
            "chat-popup-window " +
            (active ? 'active ' : '') +
            (user.active.mute.data ? 'no-chat-input' : '')
          }
        >
          <div className="popup-header" onClick={::this.handleActiveChatPopUpWindow}>
            <Avatar
              image={popUpChatRoom.data.chatIcon}
              name={popUpChatRoom.data.name}
              roleChatType={handleChatRoomAvatarBadges(popUpChatRoom.data, activeUser, 'role-chat')}
              accountType={handleChatRoomAvatarBadges(popUpChatRoom.data, activeUser)}
            />
            <div className="chat-room-name">
              {popUpChatRoom.data.name}
            </div>
            {
              isDirectChatRoomMemberOnline(popUpChatRoom.data.members, user.active._id) &&
              <div
                className="popup-header-icon video-cam-icon"
                title="Start Video Call"
                onClick={::this.handleRequestVideoCall}
              >
                <FontAwesome name="video-camera" />
              </div>
            }
            <div
              className="popup-header-icon close-icon"
              title="Close"
              onClick={::this.handleClosePopUpChatRoom}
            >
              <FontAwesome name="times" />
            </div>
          </div>
          <div className={"popup-body " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
            <ChatBox
              chatRoomID={popUpChatRoom.data._id}
              messages={popUpChatRoom.message.all}
              loading={popUpChatRoom.message.fetchNew.loading}
              small
            />
          </div>
          <div className="popup-footer">
            {
              !user.active.mute.data && (
                !isAudioRecorderOpen
                  ?
                  <ChatInput
                    id={"popup-" + index}
                    user={user.active}
                    chatRoomID={popUpChatRoom.data._id}
                    handleSendTextMessage={handleSendTextMessage}
                    handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                    handleSendFileMessage={handleSendFileMessage}
                    handleSendImageMessage={handleSendImageMessage}
                    disabled={isChatInputDisabled}
                    small
                  />
                  :
                  <ChatAudioRecorder
                    chatRoomID={popUpChatRoom.data._id}
                    handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                    handleSendAudioMessage={handleSendAudioMessage}
                    small
                  />
              )
            }
          </div>
        </div>
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

ChatPopUpWindow.propTypes = {
  index: PropTypes.number.isRequired,
  popUpChatRoom: PropTypes.object.isRequired,
  handleSendTextMessage: PropTypes.func.isRequired,
  handleSendFileMessage: PropTypes.func.isRequired,
  handleSendImageMessage: PropTypes.func.isRequired,
  handleSendAudioMessage: PropTypes.func.isRequired,
  handleRequestVideoCall: PropTypes.func.isRequired,
  handleActiveChatPopUpWindow: PropTypes.func.isRequired,
  active: PropTypes.bool
}

ChatPopUpWindow.defaultProps = {
  active: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPopUpWindow);
