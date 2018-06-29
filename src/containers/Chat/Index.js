import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import mapDispatchToProps from '../../actions';
import Header from '../Partial/Header';
import LeftSideDrawer from '../Partial/LeftSideDrawer';
import RightSideDrawer from '../Partial/RightSideDrawer';
import Head from '../../components/Head';
import LoadingAnimation from '../../components/LoadingAnimation';
import ChatBubble from '../../components/Chat/ChatBubble';
import ChatTyper from '../../components/Chat/ChatTyper';
import ChatInput from '../../components/Chat/ChatInput';
import ChatAudioRecorder from '../../components/Chat/ChatAudioRecorder';
import NotificationPopUp from '../../components/NotificationPopUp';
import '../../styles/Chat.scss';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeftSideDrawerOpen: false,
      isRightSideDrawerOpen: false,
      isAudioRecorderOpen: false,
      audioIndex: -1
    };
  }
  componentWillMount() {
    const {
      user,
      socketUserLogin
    } = this.props;

    socketUserLogin(user.active);
    document.body.className = '';
    document.body.classList.add('chat-page');
  }
  componentDidMount() {
    ::this.calculateViewportHeight();
    window.addEventListener('onorientationchange', ::this.calculateViewportHeight, true);
    window.addEventListener('resize', ::this.calculateViewportHeight, true);

    ::this.handleScrollToBottom();
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.message.isFetching && !this.props.message.isFetching ) ||
      ( !prevProps.message.isSending && this.props.message.isSending )
    ) {
      ::this.handleScrollToBottom();
    }
  }
  calculateViewportHeight() {
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    document.getElementById('chat-section').setAttribute('style', 'height:' + viewportHeight + 'px;');
  }
  handleScrollToBottom() {
    this.messagesBottom.scrollIntoView();
  }
  handleRightSideDrawerRender() {
    const { isRightSideDrawerOpen } = this.state;

    return (
      <MediaQuery query="(max-width: 767px)">
        {(matches) => {
          return (
            <RightSideDrawer
              handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent}
              handleRightSideDrawerToggleState={::this.handleRightSideDrawerToggleState}
              isRightSideDrawerOpen={matches ? isRightSideDrawerOpen : true}
              noOverlay={matches ? false : true}
            />
          )
        }}
      </MediaQuery>
    )
  }
  handleLeftSideDrawerToggleEvent(openTheDrawer: false) {
    this.setState({isLeftSideDrawerOpen: openTheDrawer});
  }
  handleLeftSideDrawerToggleState(state) {
    this.setState({isLeftSideDrawerOpen: state.isOpen});
  }
  handleRightSideDrawerToggleEvent(openTheDrawer: false) {
    this.setState({isRightSideDrawerOpen: openTheDrawer});
  }
  handleRightSideDrawerToggleState(state) {
    this.setState({isRightSideDrawerOpen: state.isOpen});
  }
  handleChatBoxRender() {
    const {
      user,
      typer,
      chatRoom,
      message
    } = this.props;

    if (chatRoom.all.length === 0) {
      return (
        <div className="user-no-chat-rooms">
          Hi! Welcome, create a Chat Room now.
        </div>
      )
    } else if ( !message.isFetching && message.isFetchingSuccess ) {
      return (
        <Container fluid>
          {
            message.all.length
              ?
              message.all.map((singleMessage, i) =>
                <ChatBubble
                  key={i}
                  index={i}
                  message={singleMessage}
                  isSender={(singleMessage.user._id === user.active._id) ? true : false }
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
  handleAudioRecorderToggle(event) {
    event.preventDefault();

    this.setState({isAudioRecorderOpen: !this.state.isAudioRecorderOpen});
    ::this.handleScrollToBottom();
  }
  handleSendTextMessage(newMessageID, text) {
    const {
      user,
      chatRoom,
      sendTextMessage
    } = this.props;

    sendTextMessage(newMessageID, text, user.active, chatRoom.active.data._id);
  }
  handleSendAudioMessage(newMessageID, text, audio) {
    const {
      user,
      chatRoom,
      sendAudioMessage
    } = this.props;

    if ( audio.size > 1024 * 1024 * 2 ) {
      Popup.alert('Maximum upload file size is 2MB only');
    } else {
      sendAudioMessage(newMessageID, text, audio, user.active, chatRoom.active.data._id);
    }
  }
  handleSendFileMessage(newMessageID, text, file) {
    const {
      user,
      chatRoom,
      sendFileMessage
    } = this.props;

    if ( file.size > 1024 * 1024 * 2 ) {
      Popup.alert('Maximum upload file size is 2MB only');
    } else {
      sendFileMessage(newMessageID, text, file, user.active, chatRoom.active.data._id);
    }
  }
  handleSendImageMessage(newMessageID, text, image) {
    const {
      user,
      chatRoom,
      sendImageMessage
    } = this.props;

    if ( image.type.indexOf('image/') === -1 ) {
      Popup.alert('Please select an image file');
    } else if ( image.size > 1024 * 1024 * 2 ) {
      Popup.alert('Maximum upload file size is 2MB only');
    } else {
      sendImageMessage(newMessageID, text, image, user.active, chatRoom.active.data._id);
    }
  }
  handleNotificationViewMessage(chatRoomObj) {
    const {
      user,
      chatRoom,
      changeChatRoom
    } = this.props;

    changeChatRoom(chatRoomObj, user.active._id, chatRoom.active.data._id);
    ::this.handleLeftSideDrawerToggleEvent();
    ::this.handleRightSideDrawerToggleEvent();
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
      socketIsNotTyping
    } = this.props;
    const {
      isLeftSideDrawerOpen,
      isAudioRecorderOpen
    } = this.state;

    return (
      <div
        id="chat-section"
        className={"chat-section " +
          (
            user.active.accountType === 'guest' ||
            user.active.mute.data
              ? 'no-chat-input' : ''
          )
        }
      >
        <Head title="Chat App" />
        <LeftSideDrawer
          handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent}
          handleLeftSideDrawerToggleState={::this.handleLeftSideDrawerToggleState}
          isLeftSideDrawerOpen={isLeftSideDrawerOpen}
        />
        {::this.handleRightSideDrawerRender()}
        <Header
          handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent}
          handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent}
        />
        <div className={"chat-box " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
          <div className="chat-bubbles">
            {::this.handleChatBoxRender()}
            <div
              style={{float: "left", clear: "both"}}
              ref={(element) => { this.messagesBottom = element; }}
            />
          </div>
        </div>
        {
          user.active.accountType !== 'guest' &&
          !user.active.mute.data && (
            !isAudioRecorderOpen
              ?
              <ChatInput
                user={user.active}
                activeChatRoom={chatRoom.active}
                handleSocketIsTyping={socketIsTyping}
                handleSocketIsNotTyping={socketIsNotTyping}
                handleSendTextMessage={::this.handleSendTextMessage}
                handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                handleSendFileMessage={::this.handleSendFileMessage}
                handleSendImageMessage={::this.handleSendImageMessage}
              />
              :
              <ChatAudioRecorder
                handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                handleSendAudioMessage={::this.handleSendAudioMessage}
              />
          )
        }
        <NotificationPopUp handleViewMessage={::this.handleNotificationViewMessage} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
