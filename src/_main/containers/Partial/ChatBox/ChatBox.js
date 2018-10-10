import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import {
  ChatBubble,
  ChatInput,
  ChatAudioRecorder
} from '../../../components/Chat';
import { DeleteMessageModal } from '../DeleteMessageModal';
import './styles.scss';

class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChatBoxScrollToBottom: false,
      scrollPosition: 0,
      audioIndex: -1,
      isModalOpen: false,
      selectedMessageID: ''
    };
  }
  componentDidMount() {
    this.chatBox.addEventListener('scroll', ::this.handleChatBoxScroll, true);
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.message.isFetchingNew && !this.props.message.isFetchingNew ) ||
      ( !prevProps.message.isSending && this.props.message.isSending ) ||
      this.state.isChatBoxScrollToBottom
    ) {
      ::this.handleScrollToBottom();
    }
  }
  handleScrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
  handleChatBoxScroll() {
    if ( this.chatBox.scrollTop === (this.chatBox.scrollHeight - this.chatBox.offsetHeight)) {
      this.setState({isChatBoxScrollToBottom: true});
    } else {
      this.setState({isChatBoxScrollToBottom: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      chatRoom,
      message
    } = this.props;
    const activeUser = user.active;
    const canDeleteMessageUserRoles = ['owner', 'admin', 'moderator'];
    const canDeleteMessage = canDeleteMessageUserRoles.indexOf(activeUser.role) > -1;

    if (chatRoom.all.length === 0) {
      return (
        <div className="user-no-chat-rooms">
          Hi! Welcome, create a Chat Room now.
        </div>
      )
    } else if ( !message.isFetchingNew && message.isFetchingNewSuccess ) {
      return (
        <Container fluid>
          {
            message.all.length
              ?
              message.all.map((singleMessage, i) =>
                <ChatBubble
                  key={singleMessage._id}
                  index={i}
                  message={singleMessage}
                  handleAudioPlayingToggle={::this.handleAudioPlayingToggle}
                  canDeleteMessage={canDeleteMessage}
                  handleOpenModal={::this.handleOpenModal}
                />
              )
              :
              <div className="chat-no-messages">
                No messages in this Chat Room
              </div>
          }
        </Container>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="black" />
      )
    }
  }
  handleAudioPlayingToggle(audioPlayingIndex) {
    const { audioIndex } = this.state;

    if ( audioIndex > -1 && audioIndex !== audioPlayingIndex ) {
      var previousAudio = document.getElementsByClassName('react-plyr-' + audioIndex)[0];

      if (
        previousAudio.currentTime > 0  &&
        !previousAudio.paused &&
        !previousAudio.ended &&
        previousAudio.readyState > 2
      ) {
        previousAudio.pause();
      }
    }

    this.setState({audioIndex: audioPlayingIndex});
  }
  handleOpenModal(selectedMessageID) {
    this.setState({
      isModalOpen: true,
      selectedMessageID: selectedMessageID
    });
  }
  handleCloseModal() {
    this.setState({
      isModalOpen: false,
      selectedMessageID: ''
    });
  }
  render() {
    const {
      user,
      chatRoom,
      message,
      socketIsTyping,
      socketIsNotTyping,
      isAudioRecorderOpen
    } = this.props;
    const {
      isModalOpen,
      selectedMessageID
    } = this.state;

    return (
      <div className={"chat-box-wrapper " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
        <div
          className="chat-box"
          ref={(element) => { this.chatBox = element; }}
        >
          {::this.handleChatBoxRender()}
        </div>
        {
          isModalOpen &&
          <DeleteMessageModal
            isModalOpen={isModalOpen}
            selectedMessageID={selectedMessageID}
            handleCloseModal={::this.handleCloseModal}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom,
    message: state.message
  }
}

ChatBox.propTypes = {
  isAudioRecorderOpen: PropTypes.bool
}

ChatBox.defaultProps = {
  isAudioRecorderOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
