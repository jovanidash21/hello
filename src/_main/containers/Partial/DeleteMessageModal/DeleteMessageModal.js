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

class DeleteMessageModal extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.message.delete.loading && this.props.message.delete.success ) {
      this.props.handleCloseModal();
    }
  }
  handleDeleteMessage(event) {
    event.preventDefault();

    const {
      deleteMessage,
      chatRoomID,
      selectedMessageID
    } = this.props;

    if ( chatRoomID.length > 0 && selectedMessageID.length > 0 ) {
      deleteMessage(selectedMessageID, chatRoomID);
    }
  }
  render() {
    const {
      message,
      isModalOpen,
      handleCloseModal
    } = this.props;

    return (
      <Modal
        className="delete-message-modal"
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        isDanger
      >
        <Form>
          <Modal.Header>
            <h3 className="modal-title">Delete Message</h3>
          </Modal.Header>
          <Modal.Body>
            {
              message.delete.error &&
              <Alert label={message.delete.message} />
            }
            <p>This action cannot be undone. Are you sure you want to delete this message?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="button button-default"
              onClick={handleCloseModal}
              disabled={message.delete.loading}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={::this.handleDeleteMessage}
              disabled={message.delete.loading}
            >
              Yes, Delete Message
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    chatRoom: state.chatRoom,
    message: state.message
  }
}

DeleteMessageModal.propTypes = {
  isModalOpen: PropTypes.bool,
  chatRoomID: PropTypes.string,
  selectedMessageID: PropTypes.string,
  handleCloseModal: PropTypes.func.isRequired
}

DeleteMessageModal.defaultProps = {
  isModalOpen: false,
  chatRoomID: PropTypes.string,
  selectedMessageID: ''
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteMessageModal);
