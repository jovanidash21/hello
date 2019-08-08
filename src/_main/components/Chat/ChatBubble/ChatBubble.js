import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
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
      lightboxOpen: false,
    };
  }
  handleUserTagColor(text) {
    const colors = [
      '#c62828', // tall poppy
      '#ff4081', // wild strawberry
      '#7b1fa2', // seance
      '#673ab7', // purple heart
      '#3f51b5', // san marino
      '#2962ff', // dodger blue
      '#039be5', // cerulean
      '#00838f', // blue lagoon
      '#00e5ff', // cyan
      '#26a69a', // jungle green
      '#4caf50', // fruit salad
      '#689f38', // apple
      '#c0ca33', // earls green
      '#76ff03', // chartreuse
      '#fdd835', // bright sun
      '#ff8f00', // pizazz
      '#ef6c00', // clementine
      '#d84315', // tia maria
      '#6d4c41', // kabul
      '#546c7a', // cutty sark
    ];
    var charCodeSum = 0;

    for ( var i = 0; i < text.length; i++ ) {
      charCodeSum += text.charCodeAt(i);
    }

    const j = charCodeSum % colors.length;

    return colors[j];
  }
  handleTextFormat(text, tag, slice=1, color='inherit') {
    if ( tag !== '' ) {
      return ReactHtmlParser('<' + tag + ' style="color:' + color + ';">' + text.slice(slice, -slice) + '</' + tag + '>')[0];
    }
  }
  handleMessageText() {
    const {
      message,
      small,
    } = this.props;
    var messageText = message.text;

    switch (message.messageType) {
      case 'text':
        const emojiSize = !small ? 25 : 20;
        const options = {
          style: {
            height: emojiSize,
            width: emojiSize
          }
        };

        messageText = messageText.replace(/ /g, "\u00a0");
        messageText = messageText.split(/(\<@[A-z0-9\s\.\,\:\(\)\-\_\^]+\>|\*[A-z0-9\s]+\*|\_[A-z0-9\s]+\_|\~[A-z0-9\s]+\~|\`\`\`[A-z0-9\s]+\`\`\`|\`[A-z0-9\s]+\`)/);

        for (var i = 0; i < messageText.length; i++) {
          var tag = '';
          var slice = 1;
          var color = 'inherit';

          if ( /\<@[A-z0-9\s\.\,\:\(\)\-\_\^]+\>/gi.test(messageText[i]) ) {
            tag = 'b';
            color = ::this.handleUserTagColor(messageText[i].slice(2, -1));
          } else if ( /\*[A-z0-9\s]+\*/gi.test(messageText[i]) ) {
            tag = 'b';
          } else if ( /\_[A-z0-9\s]+\_/gi.test(messageText[i]) ) {
            tag = 'i';
          } else if ( /\~[A-z0-9\s]+\~/gi.test(messageText[i]) ) {
            tag = 'strike';
          } else if ( /\`\`\`[A-z0-9\s]+\`\`\`/gi.test(messageText[i]) ) {
            tag = 'pre';
            slice = 3;
          } else if ( /\`[A-z0-9\s]+\`/gi.test(messageText[i]) ) {
            tag = 'code';
          }

          if ( tag.length > 0 ) {
            const formatText = ::this.handleTextFormat(messageText[i], tag, slice, color);

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
      user,
      messageUser,
      sender,
      dropdownTop,
      canDeleteMessage,
      small,
    } = this.props;
    const { lightboxOpen } = this.state;
    let isShowDropdownMenu = false;
    let chatUserNameOptions = {};

    if (
      ! sender &&
      (
        user.role !== 'ordinary' ||
        messageUser.role !== 'vip'
      )
    ) {
      isShowDropdownMenu = true;
    }

    if (isShowDropdownMenu) {
      chatUserNameOptions = {
        'data-mui-toggle': 'dropdown',
      };
    }

    return (
      <div className={"chat-bubble " + (small ? 'small ' : '') + (isShowDropdownMenu && dropdownTop ? 'mui-dropdown--up' : '')}>
        {
          ! small &&
          <Fragment>
            <div className="chat-user-name" {...chatUserNameOptions}>
              {messageUser.name}
            </div>
            {
              isShowDropdownMenu &&
              <ul className="dropdown-menu mui-dropdown__menu">
                {
                  (
                    user.role === 'owner' ||
                    user.role === 'admin' ||
                    messageUser !== 'vip'
                  ) &&
                  <MediaQuery query="(max-width: 767px)">
                    {(matches) => {
                      return (
                        <li>
                          <a href="#" onClick={(e) => {::this.handleAddDirectChatRoom(e, messageUser._id, matches)}}>
                            Direct Messages
                          </a>
                        </li>
                      )
                    }}
                  </MediaQuery>
                }
                {
                  messageUser.role !== 'owner' &&
                  messageUser.role !== 'admin' &&
                  <li>
                    <a href="#" onClick={::this.handleOpenBlockUnblockUserModal}>
                      {!messageUser.blocked ? 'Block' : 'Unblock'} user
                    </a>
                  </li>
                }
                {
                  (
                    ( user.role === 'owner' ||
                      user.role === 'admin' ) &&
                    ( messageUser.role !== 'owner' &&
                      messageUser.accountType !== 'admin' )
                  ) &&
                  <li>
                    <a href="#" onClick={::this.handleOpenBanUnbanUserModal}>
                      {!messageUser.ban.data ? 'Ban' : 'Unban'} user
                    </a>
                  </li>
                }
              </ul>
            }
          </Fragment>
        }
        {
          ( message.messageType === 'text' ||
          ( message.messageType === 'file' && message.fileLink.length > 0 ) ) &&
          <div className="chat-text" style={{ color: 'textColor' in message > 0 ? message.textColor : '#000000' }}>
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
          lightboxOpen &&
          <Lightbox
            mainSrc={message.fileLink}
            onCloseRequest={::this.handleLightboxToggle}
          />
        }
        {
          sender &&
          message.isSending !== undefined &&
          <div
            className={"sending-status " + (!message.isSending ? 'sent' : '')}
            title={message.isSending ? 'Message is sending' : 'Message is sent'}
          >
            <FontAwesome name={message.isSending ? 'circle-o' : 'check-circle'} />
          </div>
        }
        {
          canDeleteMessage &&
          <div
            className="cross-icon"
            title="Delete Message"
            onClick={::this.handleOpenDeleteMessageModal}
          >
            <FontAwesome name="times" />
          </div>
        }
      </div>
    )
  }
  handleLightboxToggle(event) {
    event.preventDefault();

    this.setState({lightboxOpen: !this.state.lightboxOpen});
  }
  handleAudioOnPlay(event) {
    const {
      index,
      handleAudioPlayingToggle,
    } = this.props;

    handleAudioPlayingToggle(index);
  }
  handleAddDirectChatRoom(event, userID, mobile) {
    event.preventDefault();

    const { handleAddDirectChatRoom } = this.props;

    handleAddDirectChatRoom(userID, mobile);
  }
  handleOpenBlockUnblockUserModal(event) {
    event.preventDefault();

    const {
      messageUser,
      handleOpenBlockUnblockUserModal,
    } = this.props;

    handleOpenBlockUnblockUserModal(messageUser);
  }
  handleOpenBanUnbanUserModal(event) {
    event.preventDefault();

    const {
      messageUser,
      handleOpenBanUnbanUserModal,
    } = this.props;

    handleOpenBanUnbanUserModal(messageUser);
  }
  handleOpenDeleteMessageModal(event) {
    event.preventDefault();

    const {
      message,
      canDeleteMessage,
      handleOpenDeleteMessageModal,
    } = this.props;

    if ( canDeleteMessage ) {
      handleOpenDeleteMessageModal(message._id);
    }
  }
  render() {
    const { messageUser } = this.props;

    return (
      <div className="chat-bubble-wrapper">
        <Avatar
          image={messageUser.profilePicture}
          size="25px"
          name={messageUser.name}
          roleChatType={messageUser.role}
          accountType={messageUser.accountType}
        />
        {::this.handleChatBubbleRender()}
      </div>
    )
  }
}

ChatBubble.propTypes = {
  index: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  messageUser: PropTypes.object.isRequired,
  sender: PropTypes.bool,
  dropdownTop: PropTypes.bool,
  handleAudioPlayingToggle: PropTypes.func.isRequired,
  handleAddDirectChatRoom: PropTypes.func,
  handleOpenBlockUnblockUserModal: PropTypes.func,
  handleOpenBanUnbanUserModal: PropTypes.func,
  handleOpenDeleteMessageModal: PropTypes.func,
  canDeleteMessage: PropTypes.bool,
  small: PropTypes.bool,
}

ChatBubble.defaultProps = {
  sender: false,
  dropdownTop: false,
  canDeleteMessage: false,
  handleAddDirectChatRoom: () => {},
  handleOpenBlockUnblockUserModal: () => {},
  handleOpenBanUnbanUserModal:  () => {},
  handleOpenDeleteMessageModal: () => {},
  small: false,
}

export default ChatBubble;
