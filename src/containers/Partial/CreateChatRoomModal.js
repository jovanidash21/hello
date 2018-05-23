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
    const { members } = this.state;
    const selectedMember = suggestion.suggestion;

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

    if ( chatRoomName.length > 0 && members.length > 2 ) {
      createGroupChatRoom(data);
      handleDeactivateModal();
      handleLeftSideDrawerToggleEvent(event);
    }
  }
  render() {
    const {
      user,
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
            <h2 className="modal-title">Add Chat Room</h2>
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
            <ChatMemberSelect
              userData={user.userData}
              users={user.users}
              onSuggestionSelected={::this.onSuggestionSelected}
            />
            <Button
              className="modal-button"
              size="large"
              type="submit"
              variant="raised"
              disabled={chatRoomName.length === 0 || members.length < 3 || isLoading}
            >
              Add
            </Button>
          </Form>
        </ModalDialog>
      </ModalContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

CreateChatRoomModal.propTypes = {
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
