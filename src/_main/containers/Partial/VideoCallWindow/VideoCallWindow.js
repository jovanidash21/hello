import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { getMedia } from '../../../../utils/media';
import './styles.scss';

class VideoCallWindow extends Component {
  constructor(props) {
    super(props);

    getMedia(::this.handleGetMedia, () => {});
  }
  componentWillMount() {
    this.setState({localVideoSource: getMedia(() => {}, () => {})});
  }
  componentDidUpdate() {
    if ( this.localVideoSource && this.localVideo && !this.localVideo.srcObject ) {
      this.localVideo.srcObject = this.localVideoSource;
    }
  }
  handleGetMedia(stream) {
    this.localVideoSource = stream;
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
