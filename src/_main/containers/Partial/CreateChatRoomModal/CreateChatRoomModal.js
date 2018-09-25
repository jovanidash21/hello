import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { Modal } from '../../../../components/Modal';
import {
  ChatRoomNameInput,
  ChatMember,
  ChatMemberSelect
} from '../../../components/CreateChatRoomModal';
import { Checkbox } from '../../../components/Form';
import { Alert } from '../../../../components/Alert';
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
    if ( prevProps.chatRoom.isCreating && this.props.chatRoom.isCreatingSuccess ) {
      const {
        handleCloseModal,
        handleLeftSideDrawerToggleEvent
      } = this.props;

      handleCloseModal();
      handleLeftSideDrawerToggleEvent();
    }
  }
  onChatRoomNameChange(event) {
    event.preventDefault();

    this.setState({chatRoomName: event.target.value});
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
      isModalOpen,
      handleCloseModal,
      chatType
    } = this.props;
    const {
      chatRoomName,
      isPublic,
      members
    } = this.state;
    const isButtonDisabled =
      chatRoomName.length === 0 ||
      ( !isPublic && ( members.length < 3 || members.length === 5 ) ) ||
      chatRoom.isCreating;

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
              !chatRoom.isCreating &&
              !chatRoom.isCreatingSuccess &&
              <Alert label="Error! Please try again" />
            }
            {
              chatType === 'group' &&
              <div>
                <ChatRoomNameInput
                  onChatRoomNameChange={::this.onChatRoomNameChange}
                  isDisabled={chatRoom.isCreating}
                />
                <Checkbox
                  id="chat-room-public"
                  label="Make this public"
                  onChange={::this.onIsChatRoomPublicChange}
                  isChecked={isPublic}
                />
                {
                  !isPublic &&
                  <div>
                    <div className="members-list-label">
                      Minimum of 3 members and maximum of 5 members only
                    </div>
                    <div className="members-list" disabled={chatRoom.isCreating}>
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
              </div>
            }
            {
              !isPublic &&
              <ChatMemberSelect
                user={user.active}
                users={user.all}
                onSuggestionSelected={::this.onSuggestionSelected}
                isDisabled={members.length === 5 || chatRoom.isCreating}
              />
            }
          </Modal.Body>
          {
            chatType === 'group' &&
            <Modal.Footer>
              <Button
                className="button button-default"
                onClick={handleCloseModal}
                disabled={chatRoom.isCreating}
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
