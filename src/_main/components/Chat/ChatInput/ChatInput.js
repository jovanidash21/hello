import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import ContentEditable from 'react-simple-contenteditable';
import { Button } from 'muicss/react';
import emojione from 'emojione';
import EmojiPicker from 'emojione-picker';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import { TextFormatPicker } from '../../../../components/TextFormatPicker';
import uuidv4 from 'uuid/v4';
import 'emojione-picker/css/picker.css';
import './styles.scss';

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      caretPosition: null,
      message: '',
      emojiPicker: false,
      textFormatPicker: false,
      fontStyle: 'normal',
      validMessage: false,
      maxLengthReached: false
    };
  }
  onMessageChange(event, value) {
    event.preventDefault();

    const messageValue = value;

    this.setState({message: messageValue});
    ::this.handleMessageTextLength();
  }
  onMessageKeyPress(event) {
    const { maxLengthReached } = this.state;
    const messageTextLength = ::this.handleMessageText('length');

    if ( event.key === 'Enter' ) {
      event.preventDefault();
    }

    if ( maxLengthReached || messageTextLength >= 400 ) {
      Popup.alert('Sorry, maximum of 400 characters only!');
    }
  }
  onMessageKeyUp(event) {
    const {
      user,
      activeChatRoom
    } = this.props;
    const {
      message,
      validMessage,
      maxLengthReached
    } = this.state;
    const chatInputText = document.getElementById('chat-input').innerHTML;

    if (
      message.trim().length > 0 &&
      !validMessage &&
      chatInputText.trim().length > 0
    ) {
      this.setState({validMessage: true});
    }

    if (
      message.trim().length === 0 &&
      validMessage &&
      chatInputText.trim().length === 0
    ) {
      this.setState({validMessage: false});
    }

    if ( (event.key === 'Enter') && validMessage && !maxLengthReached ) {
      ::this.handleSendTextMessageOnChange(event);

      this.setState({
        message: '',
        emojiPicker: false,
        textFormatPicker: false,
        validMessage: false
      });
    }
    ::this.handleSaveCaretPosition(event);
  }
  onMessagePaste(event) {
    const messageTextLength = ::this.handleMessageText('length');
    const maxLengthLeft = 400 - messageTextLength;

    if ( maxLengthLeft <= 0 ) {
      Popup.alert('Sorry, maximum of 400 characters only!');
    }
  }
  handleImageUploadSelect(event) {
    const { handleSendImageMessage } = this.props;
    const newMessageID = uuidv4();
    const imageName = event.target.value.split(/(\\|\/)/g).pop();

    handleSendImageMessage(newMessageID, imageName, event.target.files[0]);
  }
  handleFileUploadSelect(event) {
    const { handleSendFileMessage } = this.props;
    const newMessageID = uuidv4();
    const fileName = event.target.value.split(/(\\|\/)/g).pop();

    handleSendFileMessage(newMessageID, fileName, event.target.files[0]);
  }
  handleSaveCaretPosition(event) {
    event.preventDefault();

    if ( window.getSelection ) {
      var selection = window.getSelection();
      if ( selection.getRangeAt && selection.rangeCount ) {
        this.setState({caretPosition: selection.getRangeAt(0)});
      }
    } else if ( document.selection && document.selection.createRange ) {
      this.setState({caretPosition: document.selection.createRange()});
    } else {
      this.setState({caretPosition: null});
    }
  }
  handleEmojiPickerToggle(event) {
    event.preventDefault();

    const {
      emojiPicker,
      textFormatPicker
    } = this.state;

    this.setState({
      emojiPicker: !emojiPicker,
      textFormatPicker: false
    });
  }
  handleEmojiPickerSelect(emoji) {
    const {
      user,
      activeChatRoom,
    } = this.props;
    const {
      caretPosition,
      validMessage,
      maxLengthReached
    } = this.state;
    const messageTextLength = ::this.handleMessageText('length');

    var emojiSelect = emojione.toImage(emoji.shortname);

    if ( caretPosition ) {
      if ( window.getSelection ) {
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(caretPosition);
      } else if ( document.selection && caretPosition.select ) {
        caretPosition.select();
      }
    }

    document.getElementById('chat-input').focus();

    if ( maxLengthReached || messageTextLength >= 399 ) {
      Popup.alert('Sorry, maximum of 400 characters only!');
    } else {
      ::this.handleInsertEmoji(emojiSelect);
    }

    if ( !validMessage ) {
      this.setState({validMessage: true});
    }
  }
  handleInsertEmoji(emoji) {
    if ( window.getSelection ) {
      var selection = window.getSelection();
      if ( selection.getRangeAt && selection.rangeCount ) {
        var range = selection.getRangeAt(0);
        range.deleteContents();

        var element = document.createElement("div");
        element.innerHTML = emoji;

        var fragment = document.createDocumentFragment(), node, lastNode;
        while ( (node = element.firstChild) ) {
          lastNode = fragment.appendChild(node);
        }

        var firstNode = fragment.firstChild;
        range.insertNode(fragment);

        if ( lastNode ) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        this.setState({caretPosition: selection.getRangeAt(0)});
      }
    } else if ( document.selection && document.selection.createRange ) {
      var range = document.selection.createRange();
      range.pasteHTML(emoji);
      range.select();

      this.setState({caretPosition: document.selection.createRange()});
    }
  }
  handleTextFormatPickerToggle(event) {
    event.preventDefault();

    const { textFormatPicker } = this.state;

    this.setState({
      emojiPicker: false,
      textFormatPicker: !textFormatPicker
    });
  }
  handleFontStyle(fontStyleClick) {
    const { fontStyle } = this.state;
    var fontStyleSelect = 'normal';

    if ( fontStyleClick === fontStyle ) {
      fontStyleSelect = 'normal';
    } else {
      fontStyleSelect = fontStyleClick;
    }

    this.setState({fontStyle: fontStyleSelect});
  }
  handleMessageTextLength() {
    const messageTextLength = ::this.handleMessageText('length');

    if ( messageTextLength > 400 ) {
      this.setState({maxLengthReached: true});
    } else {
      this.setState({maxLengthReached: false});
    }
  }
  handleMessageText(type) {
    const { fontStyle } = this.state;
    var emojis = document.getElementById('chat-input').getElementsByClassName('emojione');
    var chatInputText = document.getElementById('chat-input').innerHTML;

    var nth = 0;
    chatInputText = chatInputText.replace(/<img class="emojione" alt="(.*?)" title="(.*?)" src="(.*?)"[^>]*>/g, (match, i, original) => {
      nth++;
      return emojis[nth - 1].alt;
    });

    var element = document.createElement('div');
    element.innerHTML = chatInputText;

    var messageText = element.textContent || element.innerText || "";

    if ( type === 'text' ) {
      switch ( fontStyle ) {
        case 'bold':
          return '*' + messageText + '*';
        case 'italic':
          return '_' + messageText + '_';
        case 'strike':
          return '~' + messageText + '~';
        default:
          return messageText;
      }
    } else if ( type === 'length' ) {
      return messageText.length;
    }
  }
  handleSendTextMessageOnChange(event) {
    const {
      user,
      activeChatRoom,
      handleSendTextMessage
    } = this.props;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    document.getElementById('chat-input').innerHTML = '';
    handleSendTextMessage(newMessageID, messageText);
  }
  handleSendTextMessageOnClick(event) {
    event.preventDefault();

    const {
      user,
      activeChatRoom,
      handleSendTextMessage
    } = this.props;
    const {
      validMessage,
      maxLengthReached
    } = this.state;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    if ( validMessage && !maxLengthReached ) {
      document.getElementById('chat-input').innerHTML = '';
      document.getElementById('chat-input').focus();
      handleSendTextMessage(newMessageID, messageText);

      this.setState({
        message: '',
        emojiPicker: false,
        textFormatPicker: false,
        validMessage: false
      });
    }
  }
  render() {
    const {
      handleAudioRecorderToggle,
      isDisabled
    } = this.props;
    const {
      message,
      emojiPicker,
      textFormatPicker,
      fontStyle,
      validMessage,
      maxLengthReached
    } = this.state;

    return (
      <div className={"chat-input-wrapper " + (isDisabled ? 'disabled' : '')}>
        <MediaQuery query="(min-width: 768px)">
          <div>
            {
              emojiPicker &&
              <div>
                <EmojiPicker onChange={::this.handleEmojiPickerSelect} search />
                <div className="picker-overlay" onClick={::this.handleEmojiPickerToggle} />
              </div>
            }
          </div>
        </MediaQuery>
        <div>
          {
            textFormatPicker &&
            <div>
              <TextFormatPicker
                fontStyle={fontStyle}
                handleFontStyle={::this.handleFontStyle}
              />
              <div className="picker-overlay" onClick={::this.handleTextFormatPickerToggle} />
            </div>
          }
        </div>
        <div className="chat-input">
          <ContentEditable
            className="textfield single-line"
            id="chat-input"
            placeholder="Type here"
            autoComplete="off"
            html={message}
            tagName="span"
            onClick={::this.handleSaveCaretPosition}
            onChange={::this.onMessageChange}
            onKeyPress={::this.onMessageKeyPress}
            onKeyUp={::this.onMessageKeyUp}
            onPaste={::this.onMessagePaste}
            contentEditable="plaintext-only"
          />
          <div className="extras">
            <div className="extra-buttons">
              <div
                className="audio-button"
                onClick={handleAudioRecorderToggle}
                title="Send Voice Message"
              >
                <FontAwesome name="microphone" />
              </div>
              <div className="image-button" title="Add an image">
                <input
                  id="image-button"
                  type="file"
                  onChange={::this.handleImageUploadSelect}
                />
                <label htmlFor="image-button">
                  <FontAwesome name="camera" />
                </label>
              </div>
              <div className="file-button" title="Add a File">
                <input
                  id="file-button"
                  type="file"
                  onChange={::this.handleFileUploadSelect}
                />
                <label htmlFor="file-button">
                  <FontAwesome name="paperclip" />
                </label>
              </div>
              <MediaQuery query="(min-width: 768px)">
                <div
                  className="emoji-button"
                  onClick={::this.handleEmojiPickerToggle}
                  title="Add Emoji"
                >
                  <FontAwesome name="smile-o" />
                </div>
              </MediaQuery>
              <div
                className="text-format-button"
                onClick={::this.handleTextFormatPickerToggle}
                title="Format Message"
              >
                <FontAwesome name="font" />
              </div>
            </div>
          </div>
        </div>
        <Button
          className="button button-secondary send-button"
          onClick={::this.handleSendTextMessageOnClick}
          disabled={!validMessage || maxLengthReached}
        >
          <FontAwesome
            name="paper-plane"
            size="2x"
          />
        </Button>
      </div>
    )
  }
}

ChatInput.propTypes = {
  user: PropTypes.object.isRequired,
  activeChatRoom: PropTypes.object.isRequired,
  handleSendTextMessage: PropTypes.func.isRequired,
  handleAudioRecorderToggle: PropTypes.func.isRequired,
  handleSendFileMessage: PropTypes.func.isRequired,
  handleSendImageMessage: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

export default ChatInput;
