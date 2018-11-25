import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emojify } from 'react-emojione';
import Linkify from 'react-linkify';
import ReactHtmlParser from 'react-html-parser';
import FontAwesome from 'react-fontawesome';
import Plyr from 'react-plyr';
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
  handleTextFormat(text, tag, slice=1) {
    if ( tag !== '' ) {
      return ReactHtmlParser('<' + tag + '>' + text.slice(slice, -slice) + '</' + tag + '>')[0];
    }
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
        messageText = messageText.split(/(\*[A-z0-9]+\*|\_[A-z0-9]+\_|\~[A-z0-9]+\~|\`\`\`[A-z0-9]+\`\`\`|\`[A-z0-9]+\`)/);

        for (var i = 0; i < messageText.length; i++) {
          var tag = '';
          var slice = 1;

          if ( /\*[A-z0-9]+\*/gi.test(messageText[i]) ) {
            tag = 'b';
          } else if ( /\_[A-z0-9]+\_/gi.test(messageText[i]) ) {
            tag = 'i';
          } else if ( /\~[A-z0-9]+\~/gi.test(messageText[i]) ) {
            tag = 'strike';
          } else if ( /\`\`\`[A-z0-9]+\`\`\`/gi.test(messageText[i]) ) {
            tag = 'pre';
            slice = 3;
          } else if ( /\`[A-z0-9]+\`/gi.test(messageText[i]) ) {
            tag = 'code';
          }

          if ( tag.length > 0 ) {
            const formatText = ::this.handleTextFormat(messageText[i], tag, slice);

            messageText[i] = {...formatText};
            messageText[i].key = i;
          } else {
            messageText[i] = emojify(messageText[i], options);
            messageText[i] = (<Linkify key={i} properties={{target: '_blank'}}>{messageText[i]}</Linkify>);
          }
        }
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

    return (
      <div className="chat-bubble">
        <div className="chat-user-name">
          {message.user.name}
        </div>
        {
          ( message.messageType === 'text' ||
          ( message.messageType === 'file' && message.fileLink.length > 0 ) ) &&
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
          message.messageType !== 'text' &&
          message.fileLink.length === 0 &&
          <div className="uploading-icon">
            <FontAwesome name="spinner" pulse />
          </div>
        }
        {
          message.messageType === 'image' &&
          message.fileLink.length > 0 &&
          <div
            className="image-logo"
            onClick={::this.handleLightboxToggle}
          >
            <FontAwesome name="picture-o" />
          </div>
        }
        {
          message.messageType === 'audio' &&
          message.fileLink.length > 0 &&
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
