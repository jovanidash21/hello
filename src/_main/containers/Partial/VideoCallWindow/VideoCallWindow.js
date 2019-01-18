import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { isObjectEmpty } from '../../../../utils/object';
import './styles.scss';

class VideoCallWindow extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    ::this.handleLocalVideoSource();
  }
  componentDidUpdate(prevProps) {
    if ( !isObjectEmpty(this.props.remoteVideoSource) && !this.remoteVideo.srcObject ) {
      this.remoteVideo.srcObject = this.props.remoteVideoSource;
    }
  }
  componentWillUnmount() {
    if ( this.localVideo && this.localVideo.srcObject ) {
      this.localVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  handleLocalVideoSource() {
    const { localVideoSource } = this.props;

    if ( !isObjectEmpty(localVideoSource) && !this.localVideo.srcObject ) {
      this.localVideo.srcObject = localVideoSource;
    }
  }
  handleEndVideoCall(event) {
    event.preventDefault();

    const {
      videoCall,
      handleEndVideoCall
    } = this.props;
    const peerUser = videoCall.peerUser;

    handleEndVideoCall(peerUser._id);
  }
  render() {
    const videoConstraints = {
      height: {
        min: 360,
        ideal: 720,
        max: 1080
      },
      facingMode: "user"
    };

    return (
      <div className="video-call-window">
        <video
          className="remote-video"
          ref={(element) => { this.remoteVideo = element; }}
          autoPlay
        />
        <video
          className="local-video"
          ref={(element) => { this.localVideo = element; }}
          autoPlay muted
        />
        <div className="video-call-controls">
          <div className="video-call-button end-call-button" title="Reject Video Call" onClick={::this.handleEndVideoCall}>
            <FontAwesome name="phone" size="2x" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    videoCall: state.videoCall
  }
}

VideoCallWindow.propTypes = {
  localVideoSource: PropTypes.object,
  remoteVideoSource: PropTypes.object,
  handleEndVideoCall: PropTypes.func.isRequired
}

VideoCallWindow.defaultProps = {
  localVideoSource: {},
  remoteVideoSource: {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCallWindow);
