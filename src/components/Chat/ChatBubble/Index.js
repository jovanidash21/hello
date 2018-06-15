import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emojify } from 'react-emojione';
import ReactHtmlParser from 'react-html-parser';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import Lightbox from 'react-image-lightbox';
import moment from 'moment';
import Avatar from '../../Avatar';
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
        messageText =
          '<a href="' + message.fileLink + '" target="_blank">' +
            '<img class="image-message" src="' + message.fileLink + '" />' +
          '</a>';
        messageText = ReactHtmlParser(messageText);
        messageText = '';
        break;
    }

    return messageText;
  }
  handleChatBubbleRender() {
    const {
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
              {::this.handleMessageText()}
            </div>
          </div>
          {/*
            message.createdAt &&
            <div className="chat-time">
              <TimeAgo
                date={moment(message.createdAt).format("MMM D, YYYY h:mm:ss A")}
                title={moment(message.createdAt).format("dddd - MMM D, YYYY - h:mm A")}
                minPeriod={60}
              />
            </div>
          */}
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
  render() {
    const {
      message,
      isSender
    } = this.props;

    return (
      <div className={"chat-bubble-wrapper " + (isSender ? 'reverse' : '')}>
        {
          !isSender &&
          <Avatar
            image={message.user.profilePicture}
            size="35px"
            title={message.user.name}
            accountType={message.user.accountType}
            badgeCloser
          />
        }
        <div className="chat-details">
          {
            !isSender &&
            <div className="chat-user-name">{message.user.name}</div>
          }
          {::this.handleChatBubbleRender()}
        </div>
      </div>
    )
  }
}

ChatBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isSender: PropTypes.bool.isRequired
}

export default ChatBubble;
