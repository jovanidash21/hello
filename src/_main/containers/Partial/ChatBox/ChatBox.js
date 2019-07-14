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
      ( prevProps.loading && !this.props.loading ) ||
      this.state.isChatBoxScrollToBottom
    ) {
      ::this.handleScrollToBottom();
    }

    if ( prevProps.loading && !this.props.loading ) {
      this.setState({isChatBoxScrollToBottom: true});
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
      this.setState({isChatBoxScrollToBottom: true});
    } else {
      this.setState({isChatBoxScrollToBottom: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      messages,
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
            messages.length
              ?
              messages.map((singleMessage, i) =>
                <ChatBubble
                  key={singleMessage._id}
                  index={i}
                  message={singleMessage}
                  handleAudioPlayingToggle={::this.handleAudioPlayingToggle}
                  canDeleteMessage={canDeleteMessage}
                  handleOpenModal={::this.handleOpenModal}
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
      chatRoomID,
      loading,
      socketIsTyping,
      socketIsNotTyping
    } = this.props;
    const {
      isModalOpen,
      selectedMessageID
    } = this.state;

    return (
      <ReactResizeDetector handleHeight onResize={::this.handleScrollToBottom}>
        <div
          className={"chat-box " + (loading ? 'loading' : '')}
          ref={(element) => { this.chatBox = element; }}
        >
          {::this.handleChatBoxRender()}
          {
            isModalOpen &&
            <DeleteMessageModal
              isModalOpen={isModalOpen}
              chatRoomID={chatRoomID}
              selectedMessageID={selectedMessageID}
              handleCloseModal={::this.handleCloseModal}
            />
          }
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
  loading: PropTypes.bool,
  small: PropTypes.bool
}

ChatBox.defaultProps = {
  loading: false,
  small: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
