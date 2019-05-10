import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { Modal } from '../../../../components/Modal';
import { Avatar } from '../../../../components/Avatar';
import { Alert } from '../../../../components/Alert';
import './styles.scss';

class BanUserModal extends Component {
  constructor(props) {
    super(props);
  }
  handleBanUser(event) {
    event.preventDefault();
  }
  render() {
    const {
      blockedUser,
      open,
      selectedUser,
      onClose,
    } = this.props;
    const isBlocked = selectedUser.blocked;

    return (
      <Modal
        className="ban-user-modal"
        open={open}
        onClose={onClose}
      >
        <Form onSubmit={::this.handleBanUser}>
          <Modal.Header>
            <h3 className="modal-title">Ban User</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="avatar-wrapper">
              <Avatar
                image={selectedUser.profilePicture}
                size="100px"
                name={selectedUser.name}
                roleChatType={selectedUser.role}
                accountType={selectedUser.accountType}
                badgeBigger
                badgeCloser
              />
            </div>
            <p>
              <span className="user-name mui--text-danger">{selectedUser.name}</span>&nbsp;
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin malesuada nec felis a tincidunt. Proin vehicula, nulla id tempor vulputate, velit odio viverra mauris, ac ullamcorper turpis justo nec ante.
            </p>
          </Modal.Body>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    blockedUser: state.blockedUser,
  }
}

BanUserModal.propTypes = {
  open: PropTypes.bool,
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

BanUserModal.defaultProps = {
  open: false,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BanUserModal);
