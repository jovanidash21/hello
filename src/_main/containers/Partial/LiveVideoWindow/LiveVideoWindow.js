import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { isObjectEmpty } from '../../../../utils/object';
import { Avatar } from '../../../../components/Avatar';
import './styles.scss';

class LiveVideoWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'restore'
    };
  }
  componentDidMount() {
    ::this.handleLiveVideoSource();
  }
  componentDidUpdate() {
    ::this.handleLiveVideoSource();
  }
  componentWillUnmount() {
    if ( this.liveVideo && this.liveVideo.srcObject ) {
      this.liveVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  handleLiveVideoSource() {
    const { liveVideoSource } = this.props;

    if ( !isObjectEmpty(liveVideoSource) && !this.liveVideo.srcObject ) {
      this.liveVideo.srcObject = liveVideoSource;
    }
  }
  handleCloseLiveVideo(event) {
    event.preventDefault();

    const { handleCloseLiveVideo } = this.props;

    handleCloseLiveVideo();
  }
  render() {
    const { liveUser } = this.props;
    const { display } = this.state;

    return (
      <Draggable bounds="parent" handle=".popup-header">
        <div className="live-video-window">
          <div className="popup-header">
            <Avatar
              image={liveUser.profilePicture}
              name={liveUser.name}
              roleChatType={liveUser.role}
              accountType={liveUser.accountType}
            />
            <div className="user-name">
              {liveUser.name}
            </div>
            <div className="popup-header-icon close-icon" onClick={::this.handleCloseLiveVideo}>
              <FontAwesome name="times" />
            </div>
          </div>
          <div className="popup-body">
            <video
              className="live-video"
              ref={(element) => { this.liveVideo = element; }}
              autoPlay
            />
          </div>
        </div>
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

LiveVideoWindow.propTypes = {
  liveUser: PropTypes.object.isRequired,
  liveVideoSource: PropTypes.object,
  handleCloseLiveVideo: PropTypes.func.isRequired
}

LiveVideoWindow.defaultProps = {
  liveVideoSource: {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveVideoWindow);
