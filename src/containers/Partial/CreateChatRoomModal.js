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
import '../../styles/CreateChatRoomModal.scss';

class CreateChatRoomModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatRoomName: '',
      members: [this.props.user.userData]
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
      if (members.some((memberData) => memberData._id === selectedMember._id)) {
        this.setState({
          members: [
            ...members.filter((memberData) => memberData._id !== selectedMember._id)
          ]
        });
      } else {
        this.setState({
          members: [
            ...members.filter((memberData) => memberData._id !== selectedMember._id),
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
        ...members.filter((memberData) => memberData._id !== member._id)
      ]
    });
  }
  handleAddGroupChatRoom(event) {
    event.preventDefault();

    const {
      user,
      chatType,
      createGroupChatRoom,
      handleDeactivateModal,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;
    let data = {
      name: chatRoomName,
      members: members,
      userID: user.userData._id
    }

    if (
      chatType === 'group' &&
      chatRoomName.length > 0 &&
      members.length > 2
    ) {
      createGroupChatRoom(data);
      handleDeactivateModal();
      handleLeftSideDrawerToggleEvent(event);
    }
  }
  handleAddDirectChatRoom(event, memberID) {
    const {
      user,
      chatRoom,
      createDirectChatRoom,
      socketJoinChatRoom,
      changeChatRoom,
      fetchMessages,
      chatType,
      handleDeactivateModal,
      handleLeftSideDrawerToggleEvent
    } = this.props;
    const userID = user.userData._id;
    const chatRooms = chatRoom.chatRooms;
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
        let data = {
          name: '',
          members: [userID, memberID],
          chatType: 'direct',
          userID: userID
        };

        createDirectChatRoom(data);
        handleDeactivateModal();
        handleLeftSideDrawerToggleEvent(event);
      } else {
        let data = {
          userID: userID,
          chatRoomID: directChatRoomData._id
        };

        socketJoinChatRoom(directChatRoomData._id);
        changeChatRoom(directChatRoomData);
        fetchMessages(data);
        handleDeactivateModal();
        handleLeftSideDrawerToggleEvent(event);
      }
    }
  }
  render() {
    const {
      user,
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
                    members.map((memberData, i) =>
                      <ChatMember
                        key={i}
                        index={i}
                        memberData={memberData}
                        handleDeselectMember={::this.handleDeselectMember}
                      />
                    )
                  }
                </div>
              </div>
            }
            <ChatMemberSelect
              userData={user.userData}
              users={user.users}
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
