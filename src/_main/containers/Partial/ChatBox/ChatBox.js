import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import ReactResizeDetector from 'react-resize-detector';
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
      chatBoxScrollToBottom: false,
      scrollPosition: 0,
      audioIndex: -1,
      deleteMessageModalOpen: false,
      selectedMessageID: ''
    };
  }
  componentDidMount() {
    this.chatBox.addEventListener('scroll', ::this.handleChatBoxScroll, true);
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.loading && !this.props.loading ) ||
      this.state.chatBoxScrollToBottom
    ) {
      ::this.handleScrollToBottom();
    }

    if ( prevProps.loading && !this.props.loading ) {
      this.setState({chatBoxScrollToBottom: true});
    }
  }
  handleScrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
  handleChatBoxScroll() {
    if (
      (this.chatBox.scrollTop > (this.chatBox.scrollHeight - this.chatBox.offsetHeight - 30)) ||
      (this.chatBox.offsetHeight >= this.chatBox.scrollHeight)
    ) {
      this.setState({chatBoxScrollToBottom: true});
    } else {
      this.setState({chatBoxScrollToBottom: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      messages,
      handleAddDirectChatRoom,
      handleOpenBlockUnblockUserModal,
      handleOpenBanUnbanUserModal,
      loading,
      small
    } = this.props;
    const activeUser = user.active;
    const canDeleteMessageUserRoles = ['owner', 'admin', 'moderator'];
    const canDeleteMessage = canDeleteMessageUserRoles.indexOf(activeUser.role) > -1;

    if ( !loading ) {
      return (
        <Container fluid>
          {
            messages.length > 0
              ?
              messages.map((singleMessage, i) =>
                <ChatBubble
                  key={singleMessage._id}
                  index={i}
                  user={activeUser}
                  message={singleMessage}
                  messageUser={singleMessage.user}
                  sender={singleMessage.user._id === activeUser._id}
                  dropdownTop={i >= (messages.length - 5)}
                  handleAudioPlayingToggle={::this.handleAudioPlayingToggle}
                  canDeleteMessage={canDeleteMessage}
                  handleAddDirectChatRoom={handleAddDirectChatRoom}
                  handleOpenBlockUnblockUserModal={handleOpenBlockUnblockUserModal}
                  handleOpenBanUnbanUserModal={handleOpenBanUnbanUserModal}
                  handleOpenDeleteMessageModal={::this.handleOpenDeleteMessageModal}
                  small={small}
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
      var previousAudio = this.chatBox.getElementsByClassName('react-plyr-' + audioIndex)[0];

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
  handleOpenDeleteMessageModal(selectedMessageID) {
    this.setState({
      deleteMessageModalOpen: true,
      selectedMessageID: selectedMessageID
    });
  }
  handleCloseDeleteMessageModal() {
    this.setState({
      deleteMessageModalOpen: false,
      selectedMessageID: ''
    });
  }
  render() {
    const {
      user,
      chatRoomID,
      loading,
      socketIsTyping,
      socketIsNotTyping
    } = this.props;
    const {
      deleteMessageModalOpen,
      selectedMessageID
    } = this.state;

    return (
      <ReactResizeDetector handleHeight onResize={::this.handleScrollToBottom}>
        <div className="chat-box-container">
          <div
            className={"chat-box " + (loading ? 'loading' : '')}
            ref={(element) => { this.chatBox = element; }}
          >
            {::this.handleChatBoxRender()}
            {
              deleteMessageModalOpen &&
              <DeleteMessageModal
                isModalOpen={deleteMessageModalOpen}
                chatRoomID={chatRoomID}
                selectedMessageID={selectedMessageID}
                handleCloseModal={::this.handleCloseDeleteMessageModal}
              />
            }
          </div>
        </div>
      </ReactResizeDetector>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

ChatBox.propTypes = {
  chatRoomID: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  handleAddDirectChatRoom: PropTypes.func,
  handleOpenBlockUnblockUserModal: PropTypes.func,
  handleOpenBanUnbanUserModal: PropTypes.func,
  loading: PropTypes.bool,
  small: PropTypes.bool
}

ChatBox.defaultProps = {
  handleAddDirectChatRoom: () => {},
  handleOpenBlockUnblockUserModal: () => {},
  handleOpenBanUnbanUserModal: () => {},
  loading: false,
  small: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
