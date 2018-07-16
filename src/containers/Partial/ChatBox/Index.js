import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import LoadingAnimation from '../../../components/LoadingAnimation';
import ChatBubble from '../../../components/Chat/ChatBubble';
import ChatTyper from '../../../components/Chat/ChatTyper';
import ChatInput from '../../../components/Chat/ChatInput';
import ChatAudioRecorder from '../../../components/Chat/ChatAudioRecorder';
import './styles.scss';

class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoadedAllMessages: false,
      isChatBoxScrollToBottom: false,
      isChatBoxScrollToTop: false,
      scrollPosition: 0,
      oldestMessageQuery: false,
      oldestMessageOffsetTop: 0,
      audioIndex: -1
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

    if ( prevProps.message.isFetchingNew && !this.props.message.isFetchingNew ) {
      this.setState({hasLoadedAllMessages: false});
    }

    if ( prevProps.message.isFetchingOld && !this.props.message.isFetchingOld ) {
      const {
        scrollPosition,
        oldestMessageQuery,
        oldestMessageOffsetTop
      } = this.state;
      const newOldestMessageOffsetTop = oldestMessageQuery.offsetTop;

      if (
        ( this.chatBox.scrollTop < 40 ||
        scrollPosition === this.chatBox.scrollTop ) &&
        oldestMessageQuery
      ) {
        this.chatBox.scrollTop = newOldestMessageOffsetTop - oldestMessageOffsetTop;
      }
    }

    if (
      ( prevProps.message.isFetchingNew &&
        !this.props.message.isFetchingNew &&
        this.props.message.all.length < 25 ) ||
      ( prevProps.message.isFetchingOld &&
        !this.props.message.isFetchingOld &&
        this.props.message.all.length - prevProps.message.all.length < 10 )
    ) {
      this.setState({hasLoadedAllMessages: true});
    }
  }
  handleScrollToBottom() {
    this.messagesBottom.scrollIntoView();
  }
  handleChatBoxScroll() {
    if ( this.chatBox.scrollTop === (this.chatBox.scrollHeight - this.chatBox.offsetHeight)) {
      this.setState({isChatBoxScrollToBottom: true});
    } else {
      this.setState({isChatBoxScrollToBottom: false});
    }

    if ( this.chatBox.scrollTop < 40 ) {
      this.setState({isChatBoxScrollToTop: true});
      ::this.handleFetchOldMessages();
    } else {
      this.setState({isChatBoxScrollToTop: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      typer,
      chatRoom,
      message
    } = this.props;
    const { hasLoadedAllMessages } = this.state;

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
            !hasLoadedAllMessages &&
            <div className="loading-icon">
              <FontAwesome name="spinner" size="2x" pulse />
            </div>
          }
          {
            message.all.length
              ?
              message.all.map((singleMessage, i) =>
                <ChatBubble
                  key={singleMessage._id}
                  index={i}
                  message={singleMessage}
                  isSender={(singleMessage.user._id === user.active._id) ? true : false }
                  previousMessageSenderID={i-1 !== -1 ? message.all[i-1].user._id : ''}
                  nextMessageSenderID={i !== message.all.length-1 ? message.all[i+1].user._id : ''}
                  handleAudioPlayingToggle={::this.handleAudioPlayingToggle}
                />
              )
              :
              <div className="chat-no-messages">
                No messages in this Chat Room
              </div>
          }
          <div className="chat-typers">
            {
              typer.all.length > 0 &&
              typer.all.map((singleTyper, i) =>
                <ChatTyper
                  key={i}
                  typer={singleTyper}
                />
              )
            }
          </div>
        </Container>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="black" />
      )
    }
  }
  handleFetchOldMessages() {
    const {
      user,
      chatRoom,
      message,
      fetchOldMessages
    } = this.props;
    const {
      hasLoadedAllMessages,
      isChatBoxScrollToTop
    } = this.state;

    if ( !hasLoadedAllMessages && isChatBoxScrollToTop && !message.isFetchingOld ) {
      const scrollPosition = this.chatBox.scrollTop;
      const oldestMessageQuery = document.querySelectorAll(".chat-box .chat-bubble-wrapper")[0];
      const oldestMessageOffsetTop = oldestMessageQuery.offsetTop;

      this.setState({
        scrollPosition: scrollPosition,
        oldestMessageQuery: oldestMessageQuery,
        oldestMessageOffsetTop: oldestMessageOffsetTop
      });

      fetchOldMessages(chatRoom.active.data._id, user.active._id, message.all.length);
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
  render() {
    const {
      user,
      typer,
      chatRoom,
      message,
      socketIsTyping,
      socketIsNotTyping,
      isAudioRecorderOpen
    } = this.props;

    return (
      <div className={"chat-box-wrapper " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
        <div
          className="chat-box"
          ref={(element) => { this.chatBox = element; }}
        >
          {::this.handleChatBoxRender()}
          <div
            style={{float: "left", clear: "both"}}
            ref={(element) => { this.messagesBottom = element; }}
          />
        </div>
      </div>
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
