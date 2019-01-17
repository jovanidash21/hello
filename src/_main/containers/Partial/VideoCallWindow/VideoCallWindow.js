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
  componentDidUpdate(prevProps) {
    if ( isObjectEmpty(prevProps.localVideoSource) && !isObjectEmpty(this.props.localVideoSource) ) {
      this.localVideo.srcObject = this.props.localVideoSource;
    }
  }
  componentWillUnmount() {
    if ( this.localVideo && this.localVideo.srcObject ) {
      this.localVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
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
  handleEndVideoCall: PropTypes.func.isRequired
}

VideoCallWindow.defaultProps = {
  localVideoSource: {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCallWindow);
