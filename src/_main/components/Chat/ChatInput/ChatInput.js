import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import ContentEditable from 'react-simple-contenteditable';
import FileReaderInput from 'react-file-reader-input';
import { Button } from 'muicss/react';
import emojione from 'emojione';
import EmojiPicker from 'emojione-picker';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import { TextFormatPicker } from './TextFormatPicker';
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
      textColor: '#000000',
      textStyle: 'normal',
      validMessage: false,
      maxLengthReached: false
    };
  }
  handleDivID() {
    const { id } = this.props;
    const chatInputID = 'chat-input';

    if ( id.length > 0 ) {
      return chatInputID + '-' + id;
    } else {
      return chatInputID;
    }
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
    const { user } = this.props;
    const {
      message,
      validMessage,
      maxLengthReached
    } = this.state;
    const chatInputText = document.getElementById(::this.handleDivID()).innerHTML;

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
  handleImageUploadSelect(event, results) {
    const {
      chatRoom,
      handleSendImageMessage
    } = this.props;
    const newMessageID = uuidv4();
    const image = results[0][1];
    const imageName = image.name;

    handleSendImageMessage(newMessageID, imageName, image, chatRoom.data._id);
  }
  handleFileUploadSelect(event, results) {
    const {
      chatRoom,
      handleSendFileMessage
    } = this.props;
    const newMessageID = uuidv4();
    const file = results[0][1];
    const fileName = file.name;

    handleSendFileMessage(newMessageID, fileName, file, chatRoom.data._id);
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
    const { user } = this.props;
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

    document.getElementById(::this.handleDivID()).focus();

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
  handleTextColor(textColor) {
    this.setState({textColor: textColor});
  }
  handleTextStyle(textStyleClick) {
    const { textStyle } = this.state;
    var textStyleSelect = 'normal';

    if ( textStyleClick === textStyle ) {
      textStyleSelect = 'normal';
    } else {
      textStyleSelect = textStyleClick;
    }

    this.setState({textStyle: textStyleSelect});
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
    const { textStyle } = this.state;
    var emojis = document.getElementById(::this.handleDivID()).getElementsByClassName('emojione');
    var chatInputText = document.getElementById(::this.handleDivID()).innerHTML;

    var nth = 0;
    chatInputText = chatInputText.replace(/<img class="emojione" alt="(.*?)" title="(.*?)" src="(.*?)"[^>]*>/g, (match, i, original) => {
      nth++;
      return emojis[nth - 1].alt;
    });

    var element = document.createElement('div');
    element.innerHTML = chatInputText;

    var messageText = element.textContent || element.innerText || "";

    if ( type === 'text' ) {
      switch ( textStyle ) {
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
      chatRoom,
      handleSendTextMessage
    } = this.props;
    const { textColor } = this.state;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    document.getElementById(::this.handleDivID()).innerHTML = '';
    handleSendTextMessage(newMessageID, messageText, chatRoom.data._id, textColor);
  }
  handleSendTextMessageOnClick(event) {
    event.preventDefault();

    const {
      user,
      chatRoom,
      handleSendTextMessage
    } = this.props;
    const {
      textColor,
      validMessage,
      maxLengthReached
    } = this.state;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    if ( validMessage && !maxLengthReached ) {
      document.getElementById(::this.handleDivID()).innerHTML = '';
      document.getElementById(::this.handleDivID()).focus();
      handleSendTextMessage(newMessageID, messageText, chatRoom.data._id, textColor);

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
      disabled,
      small
    } = this.props;
    const {
      message,
      emojiPicker,
      textFormatPicker,
      textColor,
      textStyle,
      validMessage,
      maxLengthReached
    } = this.state;

    return (
      <div
        className={
          "chat-input-wrapper " +
          (disabled ? 'disabled ' : '') +
          (small ? 'small' : '')
        }
      >
        <MediaQuery query="(min-width: 768px)">
          <React.Fragment>
            {
              emojiPicker &&
              <React.Fragment>
                <EmojiPicker onChange={::this.handleEmojiPickerSelect} search />
                <div className="picker-overlay" onClick={::this.handleEmojiPickerToggle} />
              </React.Fragment>
            }
          </React.Fragment>
        </MediaQuery>
        {
          textFormatPicker &&
          <React.Fragment>
            <TextFormatPicker
              textColor={textColor}
              textStyle={textStyle}
              handleTextColor={::this.handleTextColor}
              handleTextStyle={::this.handleTextStyle}
            />
            <div className="picker-overlay" onClick={::this.handleTextFormatPickerToggle} />
          </React.Fragment>
        }
        <div className="chat-input">
          <ContentEditable
            className="textfield single-line"
            id={::this.handleDivID()}
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
                className="extra-button audio-button"
                onClick={handleAudioRecorderToggle}
                title="Send Voice Message"
              >
                <FontAwesome name="microphone" />
              </div>
              <div className="extra-button image-button" title="Add an image">
                <FileReaderInput onChange={::this.handleImageUploadSelect}>
                  <FontAwesome name="camera" />
                </FileReaderInput>
              </div>
              <div className="extra-button file-button" title="Add a File">
                <FileReaderInput onChange={::this.handleFileUploadSelect}>
                  <FontAwesome name="paperclip" />
                </FileReaderInput>
              </div>
              <MediaQuery query="(min-width: 768px)">
                <div
                  className="extra-button emoji-button"
                  onClick={::this.handleEmojiPickerToggle}
                  title="Add Emoji"
                >
                  <FontAwesome name="smile-o" />
                </div>
              </MediaQuery>
              <div
                className="extra-button text-format-button"
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
  id: PropTypes.string,
  user: PropTypes.object.isRequired,
  chatRoom: PropTypes.object.isRequired,
  handleSendTextMessage: PropTypes.func.isRequired,
  handleAudioRecorderToggle: PropTypes.func.isRequired,
  handleSendFileMessage: PropTypes.func.isRequired,
  handleSendImageMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  small: PropTypes.bool
}

ChatInput.defaultProps = {
  id: '',
  disabled: false,
  small: false
}

export default ChatInput;
