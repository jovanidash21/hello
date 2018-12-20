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
    document.getElementById(::this.handleDivID()).addEventListener('scroll', ::this.handleChatBoxScroll, true);
    document.getElementById(::this.handleDivID('chat-input')).addEventListener('focus', ::this.handleScrollToBottom, true);
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.loading && !this.loading ) ||
      this.state.isChatBoxScrollToBottom
    ) {
      ::this.handleScrollToBottom();
    }
  }
  handleDivID(divID='chat-box') {
    const { id } = this.props;

    if ( id.length > 0 ) {
      return divID + '-' + id;
    } else {
      return divID;
    }
  }
  handleScrollToBottom() {
    document.getElementById(::this.handleDivID()).scrollTop = document.getElementById(::this.handleDivID()).scrollHeight;
  }
  handleChatBoxScroll() {
    if ( document.getElementById(::this.handleDivID()).scrollTop === (document.getElementById(::this.handleDivID()).scrollHeight - document.getElementById(::this.handleDivID()).offsetHeight)) {
      this.setState({isChatBoxScrollToBottom: true});
    } else {
      this.setState({isChatBoxScrollToBottom: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      message,
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
      var previousAudio = document.getElementById(::this.handleDivID()).getElementsByClassName('react-plyr-' + audioIndex)[0];

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
      socketIsNotTyping
    } = this.props;
    const {
      isModalOpen,
      selectedMessageID
    } = this.state;

    return (
      <div
        id={::this.handleDivID()}
        className={"chat-box " + (message.fetchNew.loading ? 'loading' : '')}
      >
        {::this.handleChatBoxRender()}
        {
          isModalOpen &&
          <DeleteMessageModal
            isModalOpen={isModalOpen}
            chatRoomID={chatRoom.data._id}
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
    user: state.user
  }
}

ChatBox.propTypes = {
  id: PropTypes.string,
  chatRoom: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  small: PropTypes.bool
}

ChatBox.defaultProps = {
  id: '',
  loading: false,
  small: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
