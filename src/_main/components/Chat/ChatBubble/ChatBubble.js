import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emojify } from 'react-emojione';
import MediaQuery from 'react-responsive';
import ReactHtmlParser from 'react-html-parser';
import FontAwesome from 'react-fontawesome';
import Plyr from 'react-plyr';
import TimeAgo from 'react-timeago';
import Lightbox from 'react-image-lightbox';
import moment from 'moment';
import { Avatar } from '../../Avatar';
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
    const {
      message,
      isSender
    } = this.props;
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
      isSender
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
        <div className="chat-message">
          <div className={(message.messageType !== 'image' ? 'chat-bubble ' : 'chat-image ') + (isSender ? 'right' : '')}>
            <div className="chat-text">
              {
                message.messageType === 'file' &&
                <div className="file-icon">
                  <FontAwesome name="file" />
                </div>
              }
              {
                message.messageType === 'image' &&
                <div
                  className="image-logo"
                  onClick={::this.handleLightboxToggle}
                >
                  <FontAwesome
                    name="picture-o"
                    size="4x"
                  />
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
              {::this.handleMessageText()}
            </div>
          </div>
          {
            message.messageType === 'image' &&
            isLightboxOpen &&
            <Lightbox
              mainSrc={message.fileLink}
              onCloseRequest={::this.handleLightboxToggle}
            />
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
  render() {
    const {
      message,
      isSender,
      previousMessageSenderID,
      nextMessageSenderID
    } = this.props;
    const isPreviousMessageSameSender = message.user._id === previousMessageSenderID;
    const isNextMessageSameSender = message.user._id === nextMessageSenderID;

    return (
      <div
        className={
          "chat-bubble-wrapper " +
          (isSender ? 'reverse ' : '') +
          (isPreviousMessageSameSender ? 'no-b-radius-top ' : '') +
          (isNextMessageSameSender ? 'no-b-radius-bottom ' : '') +
          (!isSender && isPreviousMessageSameSender ? 'no-avatar' : '')
        }
      >
        <MediaQuery query="(min-width: 768px)">
          {(matches) => {
            return (
              <div>
                {
                  !isSender &&
                  !isPreviousMessageSameSender &&
                  <Avatar
                    image={message.user.profilePicture}
                    size={matches ? '35px' : '25px'}
                    title={message.user.name}
                    role={message.user.role}
                    accountType={message.user.accountType}
                    badgeCloser={matches ? true : false}
                  />
                }
              </div>
            )
          }}
        </MediaQuery>
        <div className="chat-details">
          {
            !isSender &&
            !isPreviousMessageSameSender &&
            <div className="chat-user-name">{message.user.name}</div>
          }
          {::this.handleChatBubbleRender()}
        </div>
      </div>
    )
  }
}

ChatBubble.propTypes = {
  index: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
  isSender: PropTypes.bool.isRequired,
  previousMessageSenderID: PropTypes.string.isRequired,
  nextMessageSenderID: PropTypes.string.isRequired,
  handleAudioPlayingToggle: PropTypes.func.isRequired
}

export default ChatBubble;
