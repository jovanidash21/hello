import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import uuidv4 from 'uuid/v4';
import mapDispatchToProps from '../../../actions';
import { handleChatRoomAvatarBadges } from '../../../../utils/avatar';
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
          <div className="popup-header">
            <Avatar
              image={popUpChatRoom.data.chatIcon}
              name={popUpChatRoom.data.name}
              roleChatType={handleChatRoomAvatarBadges(popUpChatRoom.data, user, 'role-chat')}
              accountType={handleChatRoomAvatarBadges(popUpChatRoom.data, user)}
            />
            <div className="chat-room-name">
              {popUpChatRoom.data.name}
              {
                popUpChatRoom.data.chatType === 'private' &&
                <span className="you-label">(you)</span>
              }
            </div>
            <div className="close-icon" onClick={::this.handleClosePopUpChatRoom}>
              <FontAwesome name="times" />
            </div>
          </div>
          <div className={"popup-body " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
            <ChatBox
              id={"popup-" + index}
              chatRoom={popUpChatRoom}
              message={popUpChatRoom.message}
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
                    chatRoom={popUpChatRoom}
                    handleSendTextMessage={handleSendTextMessage}
                    handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                    handleSendFileMessage={handleSendFileMessage}
                    handleSendImageMessage={handleSendImageMessage}
                    disabled={isChatInputDisabled}
                    small
                  />
                  :
                  <ChatAudioRecorder
                    chatRoom={popUpChatRoom}
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
    user: state.user,
    typer: state.typer,
    chatRoom: state.chatRoom,
    message: state.message
  }
}

ChatPopUpWindow.propTypes = {
  index: PropTypes.number.isRequired,
  popUpChatRoom: PropTypes.object.isRequired,
  handleSendTextMessage: PropTypes.func.isRequired,
  handleSendFileMessage: PropTypes.func.isRequired,
  handleSendImageMessage: PropTypes.func.isRequired,
  handleSendAudioMessage: PropTypes.func.isRequired,
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
