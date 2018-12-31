import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    return (
      <div className="video-call-window">
        <video className="remote-video" ref={(element) => { this.remoteVideo = element; }} autoPlay loop>
          <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4" />
        </video>
        <video className="local-video" ref={(element) => { this.localVideo = element; }} autoPlay muted loop>
          <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4" />
        </video>
        <div className="video-call-controls">
          <div className="video-call-button accept-call-button" title="Accept Video Call">
            <FontAwesome name="video-camera" size="2x" />
          </div>
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
