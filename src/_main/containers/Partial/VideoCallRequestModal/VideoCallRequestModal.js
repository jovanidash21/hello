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
  handleAcceptVideoCall(event) {
    event.preventDefault();

    const {
      videoCall,
      handleAcceptVideoCall
    } = this.props;
    const peerUser = videoCall.peerUser;

    handleAcceptVideoCall(peerUser._id);
  }
  handleRejectVideoCall(event) {
    event.preventDefault();

    const { handleRejectVideoCall } = this.props;

    handleRejectVideoCall();
  }
  render() {
    const {
      isModalOpen,
      videoCall
    } = this.props;
    const peerUser = videoCall.peerUser;

    return (
      <Modal
        className="video-call-request-modal"
        open={isModalOpen}
        showCloseIcon={false}
      >
        <Modal.Body>
          <div className="avatar-wrapper">
            <Avatar
              image={peerUser.profilePicture}
              size="100px"
              name={peerUser.name}
              roleChatType={peerUser.role}
              accountType={peerUser.accountType}
              badgeBigger
              badgeCloser
            />
          </div>
          <p>
            <span className="user-name mui--text-danger">{peerUser.name}</span>&nbsp;
            is video calling ...
          </p>
          <div className="video-call-controls">
            <button className="video-call-button accept-call-button" title="Accept Video Call" onClick={::this.handleAcceptVideoCall}>
              <FontAwesome name="video-camera" size="2x" />
            </button>
            <button className="video-call-button end-call-button" title="Reject Video Call" onClick={::this.handleRejectVideoCall}>
              <FontAwesome name="phone" size="2x" />
            </button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    videoCall: state.videoCall
  }
}

VideoCallRequestModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleAcceptVideoCall: PropTypes.func.isRequired,
  handleRejectVideoCall: PropTypes.func.isRequired
}

VideoCallRequestModal.defaultProps = {
  isModalOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCallRequestModal);
