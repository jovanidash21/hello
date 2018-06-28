import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../actions';
import ChatRoomNameInput from '../../components/CreateChatRoomModal/ChatRoomNameInput';
import ChatMember from '../../components/CreateChatRoomModal/ChatMember';
import ChatMemberSelect from '../../components/CreateChatRoomModal/ChatMemberSelect';
import ErrorCard from '../../components/AuthForm/Card/ErrorCard';
import '../../styles/CreateChatRoomModal.scss';

class CreateChatRoomModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatRoomName: '',
      members: [this.props.user.active]
    }
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.chatRoom.isCreating && this.props.chatRoom.isCreatingSuccess ) {
      const {
        handleDeactivateModal,
        handleLeftSideDrawerToggleEvent
      } = this.props;

      handleDeactivateModal();
      handleLeftSideDrawerToggleEvent();
    }
  }
  onChatRoomNameChange(event) {
    event.preventDefault();

    this.setState({chatRoomName: event.target.value});
  }
  onSuggestionSelected(event, suggestion) {
    event.preventDefault();

    const { chatType } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;
    const selectedMember = suggestion.suggestion;

    if ( chatType === 'group' ) {
      if (members.some((singleMember) => singleMember._id === selectedMember._id)) {
        this.setState({
          members: [
            ...members.filter((singleMember) => singleMember._id !== selectedMember._id)
          ]
        });
      } else {
        this.setState({
          members: [
            ...members.filter((singleMember) => singleMember._id !== selectedMember._id),
            selectedMember
          ]
        });
      }
    } else if ( chatType === 'direct' ) {
      ::this.handleAddDirectChatRoom(event, selectedMember._id);
    }
  }
  handleDeselectMember(member) {
    const { members } = this.state;

    this.setState({
      members: [
        ...members.filter((singleMember) => singleMember._id !== member._id)
      ]
    });
  }
  handleAddGroupChatRoom(event) {
    event.preventDefault();

    const {
      user,
      chatRoom,
      chatType,
      createGroupChatRoom
    } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;
    const activeChatRoom = chatRoom.active;

    if (
      chatType === 'group' &&
      chatRoomName.length > 0 &&
      members.length > 2
    ) {
      createGroupChatRoom(chatRoomName, members, user.active._id, activeChatRoom._id);
    }
  }
  handleAddDirectChatRoom(event, memberID) {
    event.preventDefault();

    const {
      user,
      chatRoom,
      createDirectChatRoom,
      changeChatRoom,
      chatType,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const userID = user.active._id;
    const chatRooms = chatRoom.all;
    const activeChatRoom = chatRoom.active;
    var directChatRoomExists = false;
    var directChatRoomData = {};

    if ( chatType === 'direct' ) {
      for ( var i = 0; i < chatRooms.length; i++ ) {
        if ( chatRooms[i].chatType === 'direct' ) {
          var isMembersMatch = chatRooms[i].members.some(member => member._id === memberID);

          if ( isMembersMatch ) {
            directChatRoomExists = true;
            directChatRoomData = chatRooms[i];
            break;
          } else {
            continue;
          }
        } else {
          continue;
        }
      }

      if ( ! directChatRoomExists ) {
        createDirectChatRoom(userID, memberID, activeChatRoom._id);
      } else {
        changeChatRoom(directChatRoomData, userID, activeChatRoom._id);
        handleLeftSideDrawerToggleEvent();
      }
    }
  }
  render() {
    const {
      user,
      chatRoom,
      chatType,
      handleDeactivateModal,
      isLoading
    } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;

    return (
     <ModalContainer onClose={handleDeactivateModal}>
        <ModalDialog
          className="add-chat-room-modal"
          style={{width: '300px'}}
          onClose={handleDeactivateModal}
        >
          {
            !chatRoom.isCreating &&
            !chatRoom.isCreatingSuccess &&
            <ErrorCard label="Error! Please try again" />
          }
          <Form onSubmit={::this.handleAddGroupChatRoom}>
            <h2 className="modal-title">
              {
                chatType === 'group'
                  ? 'Add Chat Room'
                  : 'Select User'
              }
            </h2>
            {
              chatType === 'group' &&
              <div>
                <ChatRoomNameInput  onChatRoomNameChange={::this.onChatRoomNameChange} />
                <div className="members-list-label">
                  Select atleast 3 members
                </div>
                <div className="members-list">
                  {
                    members.map((member, i) =>
                      <ChatMember
                        key={i}
                        index={i}
                        member={member}
                        handleDeselectMember={::this.handleDeselectMember}
                      />
                    )
                  }
                </div>
              </div>
            }
            <ChatMemberSelect
              user={user.active}
              users={user.all}
              onSuggestionSelected={::this.onSuggestionSelected}
            />
            {
              chatType === 'group' &&
              <Button
                className="modal-button"
                size="large"
                type="submit"
                variant="raised"
                disabled={chatRoomName.length === 0 || members.length < 3 || isLoading}
              >
                Add
              </Button>
            }
          </Form>
        </ModalDialog>
      </ModalContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

CreateChatRoomModal.propTypes = {
  chatType: PropTypes.string.isRequired,
  handleDeactivateModal: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}

CreateChatRoomModal.defaultProps = {
  isLoading: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateChatRoomModal);
