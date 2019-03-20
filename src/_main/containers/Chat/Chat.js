import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import Peer from 'simple-peer';
import mapDispatchToProps from '../../actions';
import { isObjectEmpty } from '../../../utils/object';
import { getMedia } from '../../../utils/media';
import {
  Header,
  LeftSideDrawer,
  RightSideDrawer
} from '../Common';
import {
  ChatRoomsMenu,
  ChatBox,
  ChatPopUpWindow,
  ActiveChatRoom,
  ChatRoomsList,
  MembersList,
  LiveVideoWindow,
  VideoCallRequestModal,
  VideoCallWindow
} from '../Partial';
import {
  ChatInput,
  ChatAudioRecorder
} from '../../components/Chat';
import { NotificationPopUp } from '../../components/NotificationPopUp';
import {
  SOCKET_BROADCAST_REQUEST_LIVE_VIDEO,
  SOCKET_BROADCAST_ACCEPT_LIVE_VIDEO
} from '../../constants/live-video-user';
import {
  SOCKET_BROADCAST_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_CANCEL_REQUEST_VIDEO_CALL,
  SOCKET_BROADCAST_REJECT_VIDEO_CALL,
  SOCKET_BROADCAST_ACCEPT_VIDEO_CALL,
  SOCKET_BROADCAST_END_VIDEO_CALL
} from '../../constants/video-call';
import socket from '../../../socket';
import '../../styles/Chat.scss';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.videoCallPeer = null;
    this.callerPeerID = null;
    this.liveVideoPeer = null;

    this.state = {
      isLeftSideDrawerOpen: false,
      isRightSideDrawerOpen: false,
      activeChatPopUpWindow: -1,
      isAudioRecorderOpen: false,
      activeLiveVideoWindow: -1,
      localVideoSource: {},
      remoteVideoSource: {},
      isVideoCallRequestModalOpen: false,
      isVideoCallWindowOpen: false
    };
  }
  componentWillMount() {
    const {
      user,
      socketUserLogin
    } = this.props;

    socketUserLogin(user.active._id);
  }
  componentDidMount() {
    socket.on('action', (action) => {
      switch (action.type) {
        case SOCKET_BROADCAST_REQUEST_LIVE_VIDEO:
          ::this.handleAcceptLiveVideo(action.viewerID, action.peerID);
          break;
        case SOCKET_BROADCAST_ACCEPT_LIVE_VIDEO:
          ::this.handleSignalLiveVideoPeer(action.peerID, action.userID);
          break;
        case SOCKET_BROADCAST_REQUEST_VIDEO_CALL:
          this.callerPeerID = action.peerID;
          this.setState({isVideoCallRequestModalOpen: true});
          break;
        case SOCKET_BROADCAST_CANCEL_REQUEST_VIDEO_CALL:
          this.setState({isVideoCallRequestModalOpen: false});
          break;
        case SOCKET_BROADCAST_REJECT_VIDEO_CALL:
        case SOCKET_BROADCAST_END_VIDEO_CALL :
          this.setState({isVideoCallWindowOpen: false});
          break;
        case SOCKET_BROADCAST_ACCEPT_VIDEO_CALL:
          ::this.handleSignalVideoCallPeer(action.peerID);
          break;
      }
    });
  }
  componentDidUpdate(prevProps) {
    if ( isObjectEmpty(prevProps.chatRoom.active.data) && !isObjectEmpty(this.props.chatRoom.active.data) ) {
      document.body.className = '';
      document.body.classList.add('chat-page');

      ::this.calculateViewportHeight();
      window.addEventListener('onorientationchange', ::this.calculateViewportHeight, true);
      window.addEventListener('resize', ::this.calculateViewportHeight, true);
    }
  }
  calculateViewportHeight() {
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    this.chatSection.setAttribute('style', 'height:' + viewportHeight + 'px;');
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
              <MembersList
                handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent}
                handleOpenPopUpChatRoom={::this.handleOpenPopUpChatRoom}
                handleRequestLiveVideo={::this.handleRequestLiveVideo}
              />
            </RightSideDrawer>
          )
        }}
      </MediaQuery>
    )
  }
  handleLeftSideDrawerToggleEvent(openTheDrawer=false) {
    this.setState({isLeftSideDrawerOpen: openTheDrawer});
  }
  handleLeftSideDrawerToggleState(state) {
    this.setState({isLeftSideDrawerOpen: state.isOpen});
  }
  handleRightSideDrawerToggleEvent(openTheDrawer=false) {
    this.setState({isRightSideDrawerOpen: openTheDrawer});
  }
  handleRightSideDrawerToggleState(state) {
    this.setState({isRightSideDrawerOpen: state.isOpen});
  }
  handleOpenPopUpChatRoom(selectedChatRoom) {
    const {
      user,
      chatRoom,
      popUpChatRoom,
      openPopUpChatRoom,
      closePopUpChatRoom
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;
    const allPopUpChatRooms = popUpChatRoom.all;

    var popUpChatRoomIndex = allPopUpChatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === selectedChatRoom.data._id);

    if ( popUpChatRoomIndex === -1  ) {
      if ( allPopUpChatRooms.length >= 5 ) {
        closePopUpChatRoom(allPopUpChatRooms[0].data._id);
      }

      openPopUpChatRoom(selectedChatRoom, activeUser._id, activeChatRoom.data._id);
      this.setState({activeChatPopUpWindow: allPopUpChatRooms.length});
    } else {
      this.setState({activeChatPopUpWindow: popUpChatRoomIndex});
    }
  }
  handleActiveChatPopUpWindow(popUpIndex) {
    this.setState({activeChatPopUpWindow: popUpIndex});
  }
  handleActiveLiveVideoWindow(popUpIndex) {
    this.setState({activeLiveVideoWindow: popUpIndex});
  }
  handleAudioRecorderToggle(event) {
    event.preventDefault();

    this.setState({isAudioRecorderOpen: !this.state.isAudioRecorderOpen});
  }
  handleSendTextMessage(newMessageID, text, chatRoomID, textColor) {
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
      sendTextMessage(newMessageID, text, user.active, chatRoomID, textColor);
    }
  }
  handleSendAudioMessage(newMessageID, text, audio, chatRoomID) {
    const {
      user,
      sendAudioMessage
    } = this.props;
    const audioLength = new Date(audio.stopTime) - new Date(audio.startTime);

    if ( audioLength > ( 5 * 60 * 1000 ) ) {
      Popup.alert('Maximum of 5 minutes audio only');
    } else {
      sendAudioMessage(newMessageID, text, audio.blob, user.active, chatRoomID);
    }
  }
  handleSendFileMessage(newMessageID, text, file, chatRoomID) {
    const {
      user,
      chatRoom,
      sendFileMessage
    } = this.props;

    if ( file.size > 1024 * 1024 * 5 ) {
      Popup.alert('Maximum upload file size is 5MB only');
    } else {
      sendFileMessage(newMessageID, text, file, user.active, chatRoomID);
    }
  }
  handleSendImageMessage(newMessageID, text, image, chatRoomID) {
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
      sendImageMessage(newMessageID, text, image, user.active, chatRoomID);
    }
  }
  handleVideoError() {
    Popup.alert('Camera is not supported on your device!');
  }
  handleSignalLiveVideoPeer(peerID, userID = '') {
    const { setLiveVideoSource } = this.props;

    if ( this.liveVideoPeer ) {
      this.liveVideoPeer.signal(peerID);

      this.liveVideoPeer.on('stream', (remoteStream) => {
        if ( userID.length > 0 ) {
          setLiveVideoSource(userID, remoteStream);
        }
      });
    }
  }
  handleSignalVideoCallPeer(peerID) {
    if ( this.videoCallPeer ) {
      this.videoCallPeer.signal(peerID);

      this.videoCallPeer.on('stream', (remoteStream) => {
        this.setState({remoteVideoSource: remoteStream});
      });
    }
  }
  handleStartLiveVideo() {
    const {
      user,
      chatRoom,
      liveVideoUser,
      startLiveVideo,
      setLiveVideoSource
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;
    const allLiveVideoUsers = liveVideoUser.all;

    if ( activeChatRoom.data.chatType === 'public' ) {
      var liveVideoUserIndex = allLiveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === activeUser._id);

      if ( liveVideoUserIndex === -1  ) {
        startLiveVideo(activeUser, activeChatRoom.data._id);
        this.setState({activeLiveVideoWindow: allLiveVideoUsers.length});
      } else {
        this.setState({activeLiveVideoWindow: liveVideoUserIndex});
      }

      getMedia(
        (stream) => {
          setLiveVideoSource(activeUser._id, stream);
        },
        ::this.handleVideoError
      );
    }
  }
  handleRequestLiveVideo(selectedLiveVideoUser) {
    const {
      user,
      liveVideoUser,
      requestLiveVideo,
      closeLiveVideoUser
    } = this.props;
    const activeUser = user.active;
    const allLiveVideoUsers = liveVideoUser.all;

    var activeUserLiveVideoIndex = allLiveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === activeUser._id);
    var selectedLiveVideoUserIndex = allLiveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === selectedLiveVideoUser._id);

    if ( selectedLiveVideoUserIndex === -1  ) {
      this.liveVideoPeer = new Peer({
        initiator: true,
        trickle: false,
        offerConstraints: {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
          }
        }
      });

      this.liveVideoPeer.on('signal', (signal) => {
        if ( activeUserLiveVideoIndex > -1 && allLiveVideoUsers.length >= 7 ) {
          if ( activeUserLiveVideoIndex === 0 ) {
            closeLiveVideoUser(allLiveVideoUsers[1]._id);
          } else {
            closeLiveVideoUser(allLiveVideoUsers[0]._id);
          }
        } else if ( activeUserLiveVideoIndex === -1 && allLiveVideoUsers.length >= 6 ) {
          closeLiveVideoUser(allLiveVideoUsers[0]._id);
        }

        requestLiveVideo(activeUser._id, selectedLiveVideoUser, signal);
        this.setState({activeLiveVideoWindow: allLiveVideoUsers.length});
        ::this. handleRightSideDrawerToggleEvent();
      });
    } else {
      this.setState({activeLiveVideoWindow: selectedLiveVideoUserIndex});
    }
  }
  handleAcceptLiveVideo(viewerID, peerID) {
    const {
      user,
      liveVideoUser,
      acceptLiveVideo
    } = this.props;
    const activeUser = user.active;
    const allLiveVideoUsers = liveVideoUser.all;

    var activeUserLiveVideoIndex = allLiveVideoUsers.findIndex(singleLiveVideoUser => singleLiveVideoUser._id === activeUser._id);

    if ( activeUserLiveVideoIndex > -1 ) {
      this.liveVideoPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: allLiveVideoUsers[activeUserLiveVideoIndex].video.source,
      });

      ::this.handleSignalLiveVideoPeer(peerID);

      this.liveVideoPeer.on('signal', (signal) => {
        acceptLiveVideo(activeUser._id, viewerID, signal);
      });
    }
  }
  handleEndLiveVideo(userID, chatRoomID) {
    const {
      endLiveVideo,
      closeLiveVideoUser
    } = this.props;

    endLiveVideo(userID, chatRoomID);
    closeLiveVideoUser(userID);
  }
  handleRequestVideoCall(chatRoom) {
    const {
      user,
      requestVideoCall
    } = this.props;
    const activeUser = user.active;
    const chatRoomMembers = chatRoom.data.members;

    if ( chatRoom.data.chatType === 'direct' ) {
      var memberIndex = chatRoomMembers.findIndex(singleMember => singleMember._id !== activeUser._id);

      if ( memberIndex > -1 ) {
        getMedia(
          (stream) => {
            this.videoCallPeer = new Peer({
              initiator: true,
              trickle: false,
              stream: stream
            });

            this.videoCallPeer.on('signal', (signal) => {
              requestVideoCall(activeUser._id, chatRoomMembers[memberIndex], signal);
            });

            this.setState({
              localVideoSource: stream,
              remoteVideoSource: {},
              isVideoCallWindowOpen: true
            });
          },
          ::this.handleVideoError
        );
      }
    }
  }
  handleCancelRequestVideoCall(receiverID) {
    const { cancelRequestVideoCall } = this.props;

    cancelRequestVideoCall(receiverID);
    this.setState({isVideoCallWindowOpen: false});
  }
  handleAcceptVideoCall(callerID) {
    const { acceptVideoCall } = this.props;

    getMedia(
      (stream) => {
        this.videoCallPeer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream
        });

        ::this.handleSignalVideoCallPeer(this.callerPeerID);

        this.videoCallPeer.on('signal', (signal) => {
          acceptVideoCall(callerID, signal);
        });

        this.setState({
          localVideoSource: stream,
          isVideoCallRequestModalOpen: false,
          isVideoCallWindowOpen: true
        });
      },
      () => {
        ::this.handleRejectVideoCall();
        ::this.handleVideoError();
      }
    );
  }
  handleRejectVideoCall() {
    const {
      videoCall,
      rejectVideoCall
    } = this.props;
    const peerUser = videoCall.peerUser;

    rejectVideoCall(peerUser._id);
    this.setState({isVideoCallRequestModalOpen: false});
  }
  handleEndVideoCall(peerUserID) {
    const { endVideoCall } = this.props;

    endVideoCall(peerUserID);
    this.setState({isVideoCallWindowOpen: false});
  }
  handleNotificationViewMessage(chatRoomObj, mobile) {
    const {
      user,
      chatRoom,
      changeChatRoom
    } = this.props;
    const activeUser = user.active;

    if ( mobile ) {
      changeChatRoom(chatRoomObj, activeUser._id, chatRoom.active.data._id, activeUser.connectedChatRoom);
      ::this.handleLeftSideDrawerToggleEvent();
      ::this.handleRightSideDrawerToggleEvent();
    } else {
      ::this.handleOpenPopUpChatRoom(chatRoomObj);
    }
  }
  render() {
    const {
      user,
      chatRoom,
      popUpChatRoom,
      message,
      liveVideoUser,
      videoCall
    } = this.props;
    const {
      isLeftSideDrawerOpen,
      activeChatPopUpWindow,
      isAudioRecorderOpen,
      activeLiveVideoWindow,
      localVideoSource,
      remoteVideoSource,
      isVideoCallRequestModalOpen,
      isVideoCallWindowOpen
    } = this.state;
    const activeChatRoom = chatRoom.active;
    const isChatInputDisabled = chatRoom.fetch.loading || message.fetchNew.loading;

    return (
      <div className="chat-section-wrapper">
        {
          (
            ( chatRoom.fetch.success && chatRoom.all.length === 0 ) ||
            !isObjectEmpty(chatRoom.active.data)
          )
            ?
            <div
              className={"chat-section " + (user.active.mute.data ? 'no-chat-input' : '')}
              ref={(element) => { this.chatSection = element; }}
            >
              <LeftSideDrawer
                handleLeftSideDrawerToggleState={::this.handleLeftSideDrawerToggleState}
                isLeftSideDrawerOpen={isLeftSideDrawerOpen}
              >
                <ChatRoomsList
                  handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent}
                  handleOpenPopUpChatRoom={::this.handleOpenPopUpChatRoom}
                />
              </LeftSideDrawer>
              {::this.handleRightSideDrawerRender()}
              <Header
                handleOpenPopUpChatRoom={::this.handleOpenPopUpChatRoom}
                handleRequestVideoCall={::this.handleRequestVideoCall}
                handleStartLiveVideo={::this.handleStartLiveVideo}
              >
                <ActiveChatRoom
                  handleLeftSideDrawerToggleEvent={::this.handleLeftSideDrawerToggleEvent}
                  handleRightSideDrawerToggleEvent={::this.handleRightSideDrawerToggleEvent}
                />
              </Header>
              <div className={"chat-box-wrapper " + (isAudioRecorderOpen ? 'audio-recorder-open' : '')}>
                <MediaQuery query="(min-width: 768px)">
                  {
                    popUpChatRoom.all.length > 0 &&
                    <div className="chat-popup-window-wrapper">
                      {
                        popUpChatRoom.all.map((singlePopUpChatRoom, i) =>
                          <ChatPopUpWindow
                            key={i}
                            index={i}
                            popUpChatRoom={singlePopUpChatRoom}
                            handleSendTextMessage={::this.handleSendTextMessage}
                            handleSendFileMessage={::this.handleSendFileMessage}
                            handleSendImageMessage={::this.handleSendImageMessage}
                            handleSendAudioMessage={::this.handleSendAudioMessage}
                            handleRequestVideoCall={::this.handleRequestVideoCall}
                            handleActiveChatPopUpWindow={::this.handleActiveChatPopUpWindow}
                            active={activeChatPopUpWindow === i}
                          />
                        )
                      }
                    </div>
                  }
                </MediaQuery>
                {
                  liveVideoUser.all.length > 0 &&
                  <div className="live-video-window-wrapper">
                    {
                      liveVideoUser.all.map((singleLiveVideoUser, i) =>
                        <LiveVideoWindow
                          key={i}
                          index={i}
                          liveVideoUser={singleLiveVideoUser}
                          handleActiveLiveVideoWindow={::this.handleActiveLiveVideoWindow}
                          handleEndLiveVideo={::this.handleEndLiveVideo}
                          active={activeLiveVideoWindow === i}
                          loading={singleLiveVideoUser.video.loading}
                        />
                      )
                    }
                  </div>
                }
                <ChatBox
                  chatRoom={activeChatRoom.data._id}
                  messages={message.all}
                  loading={message.fetchNew.loading}
                />
              </div>
              {
                !user.active.mute.data && (
                  !isAudioRecorderOpen
                    ?
                    <ChatInput
                      user={user.active}
                      chatRoomID={activeChatRoom.data._id}
                      handleSendTextMessage={::this.handleSendTextMessage}
                      handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                      handleSendFileMessage={::this.handleSendFileMessage}
                      handleSendImageMessage={::this.handleSendImageMessage}
                      disabled={isChatInputDisabled}
                    />
                    :
                    <ChatAudioRecorder
                      chatRoomID={activeChatRoom.data._id}
                      handleAudioRecorderToggle={::this.handleAudioRecorderToggle}
                      handleSendAudioMessage={::this.handleSendAudioMessage}
                    />
                )
              }
              <MediaQuery query="(max-width: 767px)">
                {(matches) => {
                  return (
                    <NotificationPopUp
                      handleViewMessage={::this.handleNotificationViewMessage}
                      mobile={matches}
                    />
                  )
                }}
              </MediaQuery>
            </div>
            :
            <ChatRoomsMenu />
        }
        {
          isVideoCallRequestModalOpen &&
          <VideoCallRequestModal
            isModalOpen={isVideoCallRequestModalOpen}
            handleAcceptVideoCall={::this.handleAcceptVideoCall}
            handleRejectVideoCall={::this.handleRejectVideoCall}
          />
        }
        {
          isVideoCallWindowOpen &&
          <VideoCallWindow
            localVideoSource={localVideoSource}
            remoteVideoSource={remoteVideoSource}
            handleCancelRequestVideoCall={::this.handleCancelRequestVideoCall}
            handleEndVideoCall={::this.handleEndVideoCall}
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
    popUpChatRoom: state.popUpChatRoom,
    message: state.message,
    liveVideoUser: state.liveVideoUser,
    videoCall: state.videoCall
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
