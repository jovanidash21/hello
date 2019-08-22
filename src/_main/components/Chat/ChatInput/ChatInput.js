import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import ContentEditable from 'react-simple-contenteditable';
import FileReaderInput from 'react-file-reader-input';
import { Button } from 'muicss/react';
import emojione from 'emojione';
import EmojiPicker from 'emojione-picker';
import FontAwesome from 'react-fontawesome';
import Popup from 'react-popup';
import uuidv4 from 'uuid/v4';
import { TextFormatPicker } from './TextFormatPicker';
import { AutocompleteBox } from './AutocompleteBox';
import {
  getCaretPosition,
  insertHTML,
  getAutoCompleteTextQuery,
  insertAutocompleteHTML,
  removeAutocompleteHTML,
  getPlainText,
} from '../../../../utils/input';
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
      userTagging: false,
      textColor: '#000000',
      textStyle: 'normal',
      validMessage: false,
      maxLengthReached: false,
    };
  }
  componentWillMount() {
    document.addEventListener('mousedown', ::this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', ::this.handleClick, false);
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
  handleClick(event) {
    if ( this.emojiPicker && ! this.emojiPicker.contains(event.target) ) {
      this.setState({emojiPicker: false});
    }

    if ( this.textFormatPicker && ! this.textFormatPicker.contains(event.target) ) {
      this.setState({textFormatPicker: false});
    }

    if ( this.autocompleteBox && ! this.autocompleteBox.contains(event.target) ) {
      this.setState({userTagging: false});
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
      maxLengthReached,
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
        validMessage: false,
      });
    }

    if ( removeAutocompleteHTML() ) {
      this.setState({message: document.getElementById(::this.handleDivID()).innerHTML});
    }

    ::this.handleSaveCaretPosition();
    ::this.handleUserTaggingToggle();
  }
  onMessageClick(event) {
    event.preventDefault();

    ::this.handleSaveCaretPosition();
    ::this.handleUserTaggingToggle();
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
      chatRoomID,
      handleSendImageMessage,
    } = this.props;
    const newMessageID = uuidv4();
    const image = results[0][1];
    const imageName = image.name;

    handleSendImageMessage(newMessageID, imageName, image, chatRoomID);
  }
  handleFileUploadSelect(event, results) {
    const {
      chatRoomID,
      handleSendFileMessage
    } = this.props;
    const newMessageID = uuidv4();
    const file = results[0][1];
    const fileName = file.name;

    handleSendFileMessage(newMessageID, fileName, file, chatRoomID);
  }
  handleSaveCaretPosition() {
    const caretPosition = getCaretPosition( document.getElementById(::this.handleDivID()) );

    this.setState({caretPosition: caretPosition});
  }
  handleEmojiPickerToggle(event) {
    event.preventDefault();

    const {
      emojiPicker,
      textFormatPicker,
    } = this.state;

    this.setState({
      emojiPicker: !emojiPicker,
      textFormatPicker: false,
    });
  }
  handleTextFormatPickerToggle(event) {
    event.preventDefault();

    const { textFormatPicker } = this.state;

    this.setState({
      emojiPicker: false,
      textFormatPicker: !textFormatPicker,
    });
  }
  handleUserTaggingToggle() {
    const {
      chatRoomID,
      handleSearchUser
    } = this.props;
    const userTagQuery = getAutoCompleteTextQuery(document.getElementById(::this.handleDivID()));

    if ( userTagQuery.length > 0 ) {
      this.setState({
        emojiPicker: false,
        textFormatPicker: false,
        userTagging: true,
      });

      handleSearchUser(userTagQuery, chatRoomID);
    } else {
      this.setState({userTagging: false});
    }
  }
  handleEmojiPickerSelect(emoji) {
    const { user } = this.props;
    const {
      caretPosition,
      message,
      validMessage,
      maxLengthReached,
    } = this.state;
    const messageTextLength = ::this.handleMessageText('length');
    const emojiSelect = emojione.toImage(emoji.shortname);
    let newCaretPosition = caretPosition;
    let newMessage = message;

    if ( maxLengthReached || messageTextLength >= 399 ) {
      Popup.alert('Sorry, maximum of 400 characters only!');
    } else {
      newCaretPosition = insertHTML(document.getElementById(::this.handleDivID()), caretPosition, emojiSelect);
      newMessage = document.getElementById(::this.handleDivID()).innerHTML;
    }

    this.setState({
      caretPosition: newCaretPosition,
      message: newMessage,
    });

    if (!validMessage) {
      this.setState({validMessage: true});
    }
  }
  handleTextColor(textColor) {
    this.setState({textColor: textColor});
  }
  handleTextStyle(textStyleClick) {
    const { textStyle } = this.state;
    var textStyleSelect = 'normal';

    if (textStyleClick === textStyle) {
      textStyleSelect = 'normal';
    } else {
      textStyleSelect = textStyleClick;
    }

    this.setState({textStyle: textStyleSelect});
  }
  handleUserTaggingSelect(selectedUser) {
    const { user } = this.props;
    const {
      caretPosition,
      message,
      validMessage,
      maxLengthReached,
    } = this.state;
    const messageTextLength = ::this.handleMessageText('length');
    let newCaretPosition = caretPosition;
    let newMessage = message;

    if ( maxLengthReached || messageTextLength >= ( 400 - selectedUser.username.length ) ) {
      Popup.alert('Sorry, maximum of 160 characters only!');
    } else {
      newCaretPosition = insertAutocompleteHTML(document.getElementById(::this.handleDivID()), caretPosition, `<span data-id="${selectedUser._id}" class="user-username-tag">@${selectedUser.username}</span>`);
      newMessage = document.getElementById(::this.handleDivID()).innerHTML;
    }

    this.setState({
      caretPosition: newCaretPosition,
      message: newMessage,
      userTagging: false,
    });

    if ( !validMessage ) {
      this.setState({validMessage: true});
    }
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
    const messageText = getPlainText( document.getElementById(::this.handleDivID()) );

    if (type === 'text') {
      switch (textStyle) {
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
      chatRoomID,
      handleSendTextMessage,
    } = this.props;
    const { textColor } = this.state;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    document.getElementById(::this.handleDivID()).innerHTML = '';
    handleSendTextMessage(newMessageID, messageText, chatRoomID, textColor);
  }
  handleSendTextMessageOnClick(event) {
    event.preventDefault();

    const {
      user,
      chatRoomID,
      handleSendTextMessage,
    } = this.props;
    const {
      textColor,
      validMessage,
      maxLengthReached,
    } = this.state;
    const messageText = ::this.handleMessageText('text');
    const newMessageID = uuidv4();

    if (validMessage && !maxLengthReached) {
      document.getElementById(::this.handleDivID()).innerHTML = '';
      document.getElementById(::this.handleDivID()).focus();
      handleSendTextMessage(newMessageID, messageText, chatRoomID, textColor);

      this.setState({
        message: '',
        emojiPicker: false,
        textFormatPicker: false,
        validMessage: false,
      });
    }
  }
  render() {
    const {
      handleAudioRecorderToggle,
      userTagSuggestions,
      disabled,
      userTagLoading,
      small,
    } = this.props;
    const {
      message,
      emojiPicker,
      textFormatPicker,
      userTagging,
      textColor,
      textStyle,
      validMessage,
      maxLengthReached,
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
          <Fragment>
            {
              emojiPicker &&
              <div ref={(element) => { this.emojiPicker = element; }}>
                <EmojiPicker onChange={::this.handleEmojiPickerSelect} search />
              </div>
            }
          </Fragment>
        </MediaQuery>
        {
          textFormatPicker &&
          <div ref={(element) => { this.textFormatPicker = element; }}>
            <TextFormatPicker
              textColor={textColor}
              textStyle={textStyle}
              handleTextColor={::this.handleTextColor}
              handleTextStyle={::this.handleTextStyle}
            />
          </div>
        }
        {
          userTagging &&
          <div ref={(element) => { this.autocompleteBox = element; }}>
            <AutocompleteBox
              suggestions={userTagSuggestions}
              loading={userTagLoading}
              handleSelectSuggestion={::this.handleUserTaggingSelect}
            />
          </div>
        }
        <div className="chat-input">
          <ContentEditable
            className="textfield single-line"
            id={::this.handleDivID()}
            placeholder="Type here"
            autoComplete="off"
            html={message}
            tagName="span"
            onClick={::this.onMessageClick}
            onChange={::this.onMessageChange}
            onKeyPress={::this.onMessageKeyPress}
            onKeyUp={::this.onMessageKeyUp}
            onPaste={::this.onMessagePaste}
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
  chatRoomID: PropTypes.string.isRequired,
  handleSearchUser: PropTypes.func.isRequired,
  handleSendTextMessage: PropTypes.func.isRequired,
  handleAudioRecorderToggle: PropTypes.func.isRequired,
  handleSendFileMessage: PropTypes.func.isRequired,
  handleSendImageMessage: PropTypes.func.isRequired,
  userTagSuggestions: PropTypes.array,
  disabled: PropTypes.bool,
  userTagLoading: PropTypes.bool,
  small: PropTypes.bool,
}

ChatInput.defaultProps = {
  id: '',
  userTagSuggestions: [],
  disabled: false,
  userTagLoading: false,
  small: false,
}

export default ChatInput;
