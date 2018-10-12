import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { Modal } from '../../../../components/Modal';
import { Alert } from '../../../../components/Alert';
import {
  Input,
  Checkbox,
  UserSelect
} from '../../../../components/Form';
import './styles.scss';

class CreateChatRoomModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatRoomName: '',
      isPublic: false,
      members: [this.props.user.active]
    }
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.chatRoom.create.loading && this.props.chatRoom.create.success ) {
      const {
        handleCloseModal,
        handleLeftSideDrawerToggleEvent
      } = this.props;

      handleCloseModal();
      handleLeftSideDrawerToggleEvent();
    }
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  onCheckboxChange(event) {
    this.setState({[event.target.name]: event.target.checked});
  }
  onIsChatRoomPublicChange(event) {
    this.setState({isPublic: event.target.checked});
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
      createPublicChatRoom,
      createGroupChatRoom
    } = this.props;
    const {
      chatRoomName,
      isPublic,
      members
    } = this.state;
    const activeChatRoom = chatRoom.active;

    if ( isPublic && chatRoomName.length > 0 ) {
      createPublicChatRoom(chatRoomName, user.active._id, activeChatRoom._id);
    } else if (
      chatType === 'group' &&
      chatRoomName.length > 0 &&
      members.length > 2 &&
      members.length < 6
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
      handleCloseModal,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const userID = user.active._id;
    const chatRooms = chatRoom.all;
    const activeChatRoom = chatRoom.active;
    var directChatRoomExists = false;
    var directChatRoomData = {};

    if ( chatType === 'direct' ) {
      for ( var i = 0; i < chatRooms.length; i++ ) {
        if ( chatRooms[i].data.chatType === 'direct' ) {
          var isMembersMatch = chatRooms[i].data.members.some(member => member._id === memberID);

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

      if ( !directChatRoomExists ) {
        createDirectChatRoom(userID, memberID, activeChatRoom._id);
      } else {
        changeChatRoom(directChatRoomData, userID, activeChatRoom._id);
        handleCloseModal();
        handleLeftSideDrawerToggleEvent();
      }
    }
  }
  render() {
    const {
      user,
      chatRoom,
      searchUser,
      isModalOpen,
      handleCloseModal,
      chatType
    } = this.props;
    const {
      chatRoomName,
      isPublic,
      members
    } = this.state;
    const searchedUsers = user.searched.filter((singleUser) => {
      return !members.some((singleMember) => singleMember._id === singleUser._id);
    });
    const isButtonDisabled =
      chatRoomName.length === 0 ||
      ( !isPublic && ( members.length < 3 || members.length === 5 ) ) ||
      chatRoom.create.loading;

    return (
      <Modal
        className="create-chat-room-modal"
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      >
        <Form onSubmit={::this.handleAddGroupChatRoom}>
          <Modal.Header>
            <h3 className="modal-title">
              {
                chatType === 'group'
                  ? 'Add Chat Room'
                  : 'Select User'
              }
            </h3>
          </Modal.Header>
          <Modal.Body>
            {
              chatRoom.create.error &&
              <Alert label={chatRoom.create.message} />
            }
            {
              chatType === 'group' &&
              <div>
                <Input
                  value={chatRoomName}
                  label="Chat Room Name"
                  name="chatRoomName"
                  onChange={::this.onInputChange}
                  disabled={chatRoom.create.loading}
                />
                <Checkbox
                  id="chat-room-public"
                  label="Make this public"
                  name="isPublic"
                  onChange={::this.onCheckboxChange}
                  checked={isPublic}
                  disabled={chatRoom.create.loading}
                />
              </div>
            }
            {
              !isPublic &&
              <UserSelect
                label={chatType === 'group' ? 'Minimum of 3 members and maximum of 5 members only' : ''}
                placeholder="Select a member"
                showUsersList={chatType === 'group'}
                handleSearchUser={searchUser}
                selectedUsers={members}
                searchedUsers={searchedUsers}
                onSuggestionSelected={::this.onSuggestionSelected}
                handleDeselectUser={::this.handleDeselectMember}
                isListDisabled={chatRoom.create.loading}
                isInputDisabled={chatRoom.create.loading}
                isLoading={user.search.loading}
              />
            }
          </Modal.Body>
          {
            chatType === 'group' &&
            <Modal.Footer>
              <Button
                className="button button-default"
                onClick={handleCloseModal}
                disabled={chatRoom.create.loading}
              >
                Cancel
              </Button>
              <Button
                className="button button-primary"
                type="submit"
                disabled={isButtonDisabled}
              >
                Create
              </Button>
            </Modal.Footer>
          }
        </Form>
      </Modal>
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
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired,
  chatType: PropTypes.string.isRequired
}

CreateChatRoomModal.defaultProps = {
  isModalOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateChatRoomModal);
