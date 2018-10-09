import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emojify } from 'react-emojione';
import ReactHtmlParser from 'react-html-parser';
import FontAwesome from 'react-fontawesome';
import Plyr from 'react-plyr';
import TimeAgo from 'react-timeago';
import Lightbox from 'react-image-lightbox';
import moment from 'moment';
import { Avatar } from '../../../../components/Avatar';
import 'react-image-lightbox/style.css';
import './styles.scss';

class ChatBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLightboxOpen: false
    };
  }
  handleMessageText() {
    const { message } = this.props;
    var messageText = message.text;

    switch (message.messageType) {
      case 'text':
        const options = {
          style: {
            height: 25,
            width: 25
          }
        };

        messageText = messageText.replace(/ /g, "\u00a0");
        messageText = emojify(messageText, options);
        break;
      case 'file':
        messageText = '<a download="' + messageText + '" href="' + message.fileLink + '" target="_blank">' + messageText + '</a>';
        messageText = ReactHtmlParser(messageText);
        break;
      case 'image':
        messageText = '';
        break;
      case 'audio':
        messageText = '';
        break
    }

    return messageText;
  }
  handleChatBubbleRender() {
    const {
      index,
      message,
      canDeleteMessage
    } = this.props;
    const { isLightboxOpen } = this.state;

    if ( message.messageType !== 'text' && message.fileLink.length === 0 ) {
      return (
        <div className="uploading-icon">
          <FontAwesome name="spinner" pulse />
        </div>
      )
    } else {
      return (
        <div className="chat-bubble">
          <div className="chat-user-name">
            {message.user.name}
          </div>
          {
            ( message.messageType === 'text' || message.messageType === 'file' ) &&
            <div className="chat-text">
              {
                message.messageType === 'file' &&
                <div className="file-icon">
                  <FontAwesome name="file" />
                </div>
              }
              {::this.handleMessageText()}
            </div>
          }
          {
            message.messageType === 'image' &&
            <div
              className="image-logo"
              onClick={::this.handleLightboxToggle}
            >
              <FontAwesome name="picture-o" />
            </div>
          }
          {
            message.messageType === 'audio' &&
            <Plyr
              className={"react-plyr-" + index}
              type="audio"
              url={message.fileLink}
              volume={1}
              onPlay={::this.handleAudioOnPlay}
            />
          }
          {
            message.messageType === 'image' &&
            isLightboxOpen &&
            <Lightbox
              mainSrc={message.fileLink}
              onCloseRequest={::this.handleLightboxToggle}
            />
          }
          {
            canDeleteMessage &&
            <div
              className="cross-icon"
              title="Delete Message"
              onClick={::this.handleOpenModal}
            >
              <FontAwesome name="times" />
            </div>
          }
        </div>
      )
    }
  }
  handleLightboxToggle(event) {
    event.preventDefault();

    this.setState({isLightboxOpen: !this.state.isLightboxOpen});
  }
  handleAudioOnPlay(event) {
    const {
      index,
      handleAudioPlayingToggle
    } = this.props;

    handleAudioPlayingToggle(index);
  }
  handleOpenModal(event) {
    event.preventDefault();

    const {
      message,
      canDeleteMessage,
      handleOpenModal
    } = this.props;

    if ( canDeleteMessage ) {
      handleOpenModal(message._id);
    }
  }
  render() {
    const { message } = this.props;

    return (
      <div className="chat-bubble-wrapper">
        <Avatar
          image={message.user.profilePicture}
          size="25px"
          name={message.user.name}
          roleChatType={message.user.role}
          accountType={message.user.accountType}
        />
        {::this.handleChatBubbleRender()}
      </div>
    )
  }
}

ChatBubble.propTypes = {
  index: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
  handleAudioPlayingToggle: PropTypes.func.isRequired,
  canDeleteMessage: PropTypes.bool,
  handleOpenModal: PropTypes.func
}

ChatBubble.defaultProps = {
  canDeleteMessage: false,
  handleOpenModal: () => {}
}

export default ChatBubble;
