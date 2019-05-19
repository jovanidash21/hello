import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button
} from 'muicss/react';
import { Modal } from '../../../Modal';
import { Alert } from '../../../Alert';

class UnbanAllUsersModal extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.bannedUserUnbanAll.loading && this.props.bannedUserUnbanAll.success ) {
      this.props.onClose();
    }
  }
  handleUnbanAllUsers(event) {
    event.preventDefault();

    const { handleUnbanAllUsers } = this.props;

    handleUnbanAllUsers();
  }
  render() {
    const {
      bannedUserUnbanAll,
      open,
      onClose
    } = this.props;

    return (
      <Modal
        className="unban-all-users-modal"
        open={open}
        onClose={onClose}
        danger
      >
        <Form>
          <Modal.Header>
            <h3 className="modal-title">Unban All Users</h3>
          </Modal.Header>
          <Modal.Body>
            {
              bannedUserUnbanAll.error &&
              <Alert label={bannedUserUnbanAll.message} />
            }
            <p>Are you sure you want to unban all users?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="button button-default"
              onClick={onClose}
              disabled={bannedUserUnbanAll.loading}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={::this.handleUnbanAllUsers}
              disabled={bannedUserUnbanAll.loading}
            >
              Yes, Unban All
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

UnbanAllUsersModal.propTypes = {
  handleUnbanAllUsers: PropTypes.func.isRequired,
  bannedUserUnbanAll: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

UnbanAllUsersModal.defaultProps = {
  open: false,
}

export default UnbanAllUsersModal;
