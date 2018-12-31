import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { Modal } from '../../../../components/Modal';
import { Avatar } from '../../../../components/Avatar';
import './styles.scss';

class VideoCallRequestModal extends Component {
  constructor(props) {
    super(props);
  }
  handleCloseModal(event) {
    event.preventDefault();

    const { handleCloseModal } = this.props;

    handleCloseModal();
  }
  render() {
    const {
      isModalOpen,
      user
    } = this.props;

    return (
      <Modal
        className="video-call-request-modal"
        open={isModalOpen}
        showCloseIcon={false}
      >
        <Modal.Body>
          <div className="avatar-wrapper">
            <Avatar
              image={user.profilePicture}
              size="100px"
              name={user.name}
              roleChatType={user.role}
              accountType={user.accountType}
              badgeBigger
              badgeCloser
            />
          </div>
          <p>
            <span className="user-name mui--text-danger">{user.name}</span>&nbsp;
            is video calling ...
          </p>
          <div className="video-call-controls">
            <div className="video-call-button accept-call-button" title="Accept Video Call">
              <FontAwesome name="video-camera" size="2x" />
            </div>
            <div className="video-call-button end-call-button" title="Reject Video Call" onClick={::this.handleCloseModal}>
              <FontAwesome name="phone" size="2x" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

VideoCallRequestModal.propTypes = {
  isModalOpen: PropTypes.bool,
  user: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired
}

VideoCallRequestModal.defaultProps = {
  isModalOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCallRequestModal);
