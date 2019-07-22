import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
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
      publicChatRoom: false,
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
    this.setState({publicChatRoom: event.target.checked});
  }
  onSuggestionSelected(event, suggestion, mobile) {
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
      ::this.handleAddDirectChatRoom(selectedMember._id, mobile);
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
      publicChatRoom,
      members
    } = this.state;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;

    if ( publicChatRoomc && chatRoomName.length > 0 ) {
      createPublicChatRoom(chatRoomName, activeUser._id, activeChatRoom._id, activeUser.connectedChatRoom);
    } else if (
      chatType === 'group' &&
      chatRoomName.length > 0 &&
      members.length > 2 &&
      members.length < 6
    ) {
      createGroupChatRoom(chatRoomName, members, activeUser._id, activeChatRoom._id, activeUser.connectedChatRoom);
    }
  }
  handleAddDirectChatRoom(memberID, mobile) {
    const {
      user,
      chatRoom,
      createDirectChatRoom,
      changeChatRoom,
      chatType,
      handleCloseModal,
      handleLeftSideDrawerToggleEvent,
      handleOpenPopUpChatRoom
    } = this.props;
    const activeUser = user.active;
    const userID = activeUser._id;
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
        createDirectChatRoom(userID, memberID, activeChatRoom._id, activeUser.connectedChatRoom, !mobile)
          .then((chatRoom) => {
            if ( ! mobile ) {
              handleOpenPopUpChatRoom(chatRoom);
            }
          });
      } else {
        if ( mobile ) {
          changeChatRoom(directChatRoomData, userID, activeChatRoom._id, activeUser.connectedChatRoom);
        } else {
          handleOpenPopUpChatRoom(directChatRoomData);
        }

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
      publicChatRoom,
      members
    } = this.state;
    const searchedUsers = user.searched.filter((singleUser) => {
      return !members.some((singleMember) => singleMember._id === singleUser._id);
    });
    const isButtonDisabled =
      chatRoomName.length === 0 ||
      ( ! publicChatRoom && ( members.length < 3 || members.length === 5 ) ) ||
      chatRoom.create.loading;

    return (
      <Modal
        className="create-chat-room-modal"
        open={isModalOpen}
        onClose={handleCloseModal}
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
              <Fragment>
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
                  name="publicChatRoom"
                  onChange={::this.onCheckboxChange}
                  checked={publicChatRoom}
                  disabled={chatRoom.create.loading}
                />
              </Fragment>
            }
            {
              ! publicChatRoom &&
              <MediaQuery query="(max-width: 767px)">
                {(matches) => {
                  return (
                    <UserSelect
                      label={chatType === 'group' ? 'Minimum of 3 members and maximum of 5 members only' : ''}
                      placeholder="Select a member"
                      showUsersList={chatType === 'group'}
                      handleSearchUser={searchUser}
                      selectedUsers={members}
                      searchedUsers={searchedUsers}
                      onSuggestionSelected={(e, suggestion) => {::this.onSuggestionSelected(e, suggestion, matches)}}
                      handleDeselectUser={::this.handleDeselectMember}
                      listDisabled={chatRoom.create.loading}
                      inputDisabled={chatRoom.create.loading}
                      loading={user.search.loading}
                    />
                  )
                }}
              </MediaQuery>
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
  handleOpenPopUpChatRoom: PropTypes.func.isRequired,
  chatType: PropTypes.string.isRequired
}

CreateChatRoomModal.defaultProps = {
  isModalOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateChatRoomModal);
