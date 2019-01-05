import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import './styles.scss';

class VideoCallWindow extends Component {
  constructor(props) {
    super(props);
  }
  handleCloseWindow(event) {
    event.preventDefault();

    const { handleCloseWindow } = this.props;

    handleCloseWindow();
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
        <Webcam
          className="remote-video"
          videoConstraints={videoConstraints}
          ref={this.remoteVideo}
          audio={false}
        />
        <Webcam
          className="local-video"
          videoConstraints={videoConstraints}
          ref={this.localVideo}
        />
        <div className="video-call-controls">
          <div className="video-call-button end-call-button" title="Reject Video Call" onClick={::this.handleCloseWindow}>
            <FontAwesome name="phone" size="2x" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

VideoCallWindow.propTypes = {
  handleCloseWindow: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCallWindow);
