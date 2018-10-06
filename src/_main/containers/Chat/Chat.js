import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../actions';
import {
  Header,
  LeftSideDrawer,
  RightSideDrawer
} from '../Common';
import {
  ChatRoomsMenu,
  ChatBox,
  ActiveChatRoom,
  ChatRoomsList,
  MembersList
} from '../Partial';
import {
  ChatInput,
  ChatAudioRecorder
} from '../../components/Chat';
import { NotificationPopUp } from '../../components/NotificationPopUp';
import '../../styles/Chat.scss';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeftSideDrawerOpen: false,
      isRightSideDrawerOpen: false,
      isAudioRecorderOpen: false
    };
  }
  componentWillMount() {
    const {
      user,
      socketUserLogin
    } = this.props;

    socketUserLogin(user.active);
  }
  componentDidUpdate(prevProps) {
    if (
      ( Object.keys(prevProps.chatRoom.active.data).length === 0 && prevProps.chatRoom.active.data.constructor === Object ) &&
      ( Object.keys(this.props.chatRoom.active.data).length > 0 && this.props.chatRoom.active.data.constructor === Object )
    ) {
      document.body.className = '';
      document.body.classList.add('chat-page');

      ::this.calculateViewportHeight();
      window.addEventListener('onorientationchange', ::this.calculateViewportHeight, true);
      window.addEventListener('resize', ::this.calculateViewportHeight, true);
    }
  }
  calculateViewportHeight() {
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    document.getElementById('chat-section').setAttribute('style', 'height:' + viewportHeight + 'px;');
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
  handleRightSideDrawerRender() {
    const { isRightSideDrawerOpen } = this.state;

    return (
      <MediaQuery query="(max-width: 767px)">
        {(matches) => {
          return (
            <RightSideDrawer
              handleRightSideDrawerToggleState={::this.handleRightSideDrawerToggleState}
              isRightSideDrawerOpen={matches ? isRightSideDrawerOpen : true}
              noOverlay={matches ? false : true}
            >
              <MembersList handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent} />
            </RightSideDrawer>
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
  handleAudioRecorderToggle(event) {
    event.preventDefault();

    this.setState({isAudioRecorderOpen: !this.state.isAudioRecorderOpen});
  }
  handleSendTextMessage(newMessageID, text) {
    const {
      user,
      chatRoom,
      message,
      sendTextMessage
    } = this.props;
    const allMessages = message.all;
    var validMessage = true;

    if ( allMessages.length > 0 ) {
      const lastMessage = allMessages[allMessages.length - 1];
      const todayDate = new Date();
      const lastMessageDate = new Date(lastMessage.createdAt);
      const lastMessageUserID = lastMessage.user._id;

      if ( user.active._id === lastMessageUserID && ( todayDate - lastMessageDate ) <= 2000 ) {
        validMessage = false;
      }
    }

    if ( !validMessage ) {
      Popup.alert('Please take a break and send message slowly!');
    } else {
      sendTextMessage(newMessageID, text, user.active, chatRoom.active.data._id);
    }
  }
  handleSendAudioMessage(newMessageID, text, audio) {
    const {
      user,
      chatRoom,
      sendAudioMessage
    } = this.props;
    const audioLength = new Date(audio.stopTime) - new Date(audio.startTime);

    if ( audioLength > ( 5 * 60 * 1000 ) ) {
      Popup.alert('Maximum of 5 minutes audio only');
    } else {
      sendAudioMessage(newMessageID, text, audio.blob, user.active, chatRoom.active.data._id);
    }
  }
  handleSendFileMessage(newMessageID, text, file) {
    const {
      user,
      chatRoom,
      sendFileMessage
    } = this.props;

    if ( file.size > 1024 * 1024 * 5 ) {
      Popup.alert('Maximum upload file size is 5MB only');
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
    } else if ( image.size > 1024 * 1024 * 5 ) {
      Popup.alert('Maximum upload file size is 5MB only');
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
    const isChatInputDisabled = chatRoom.isFetching || message.isFetchingNew;

    return (
      <div className="chat-section-wrapper">
        {
          ( Object.keys(chatRoom.active.data).length > 0 && chatRoom.active.data.constructor === Object )
            ?
            <div
              id="chat-section"
              className={"chat-section " + (user.active.mute.data ? 'no-chat-input' : '')}
            >
              <LeftSideDrawer
                handleLeftSideDrawerToggleState={::this.handleLeftSideDrawerToggleState}
                isLeftSideDrawerOpen={isLeftSideDrawerOpen}
              >
                <ChatRoomsList handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent} />
              </LeftSideDrawer>
              {::this.handleRightSideDrawerRender()}
              <Header>
                <ActiveChatRoom
                  handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent}
                  handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent}
                />
              </Header>
              <ChatBox isAudioRecorderOpen={isAudioRecorderOpen} />
              {
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
                      isDisabled={isChatInputDisabled}
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
            :
            <ChatRoomsMenu />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
