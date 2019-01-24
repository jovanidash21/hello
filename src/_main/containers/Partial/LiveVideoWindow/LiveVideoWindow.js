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
  handleWindowDisplay(event, display) {
    event.preventDefault();

    if ( display.length > 0 ) {
      this.setState({display: display});
    }
  }
  handleEndLiveVideo(end) {
    event.preventDefault();

    const {
      user,
      chatRoom,
      handleEndLiveVideo
    } = this.props;
    const activeUser = user.active;
    const activeChatRoom = chatRoom.active;

    handleEndLiveVideo(activeUser._id, activeChatRoom.data._id);
  }
  handleCloseLiveVideo(event) {
    event.preventDefault();

    const { handleCloseLiveVideo } = this.props;

    handleCloseLiveVideo();
  }
  render() {
    const {
      user,
      liveVideo
    } = this.props;
    const { display } = this.state;
    const activeUser = user.active;
    const liveVideoUser = liveVideo.user;

    return (
      <Draggable bounds="parent" handle=".popup-header">
        <div className={"live-video-window " + display}>
          <div className="popup-header">
            <Avatar
              image={liveVideoUser.profilePicture}
              name={liveVideoUser.name}
              roleChatType={liveVideoUser.role}
              accountType={liveVideoUser.accountType}
            />
            <div className="user-name">
              {liveVideoUser.name}
            </div>
            {
              display !== 'minimize' &&
              <div
                className="popup-header-icon minimize-icon"
                title="Minimize"
                onClick={(e) => {::this.handleWindowDisplay(e, 'minimize')}}
              >
                <FontAwesome name="window-minimize" />
              </div>
            }
            {
              display !== 'restore' &&
              <div
                className="popup-header-icon restore-icon"
                title="Restore"
                onClick={(e) => {::this.handleWindowDisplay(e, 'restore')}}
              >
                <FontAwesome name="window-restore" />
              </div>
            }
            {
              display !== 'maximize' &&
              <div
                className="popup-header-icon maximize-icon"
                title="Maximize"
                onClick={(e) => {::this.handleWindowDisplay(e, 'maximize')}}
              >
                <FontAwesome name="window-maximize" />
              </div>
            }
            <div
              className="popup-header-icon close-icon"
              title="Close"
              onClick={
                activeUser._id === liveVideoUser._id
                  ? ::this.handleEndLiveVideo
                  : ::this.handleCloseLiveVideo
              }
            >
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
    user: state.user,
    chatRoom: state.chatRoom,
    liveVideo: state.liveVideo
  }
}

LiveVideoWindow.propTypes = {
  liveVideoSource: PropTypes.object,
  handleEndLiveVideo: PropTypes.func.isRequired,
  handleCloseLiveVideo: PropTypes.func.isRequired
}

LiveVideoWindow.defaultProps = {
  liveVideoSource: {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveVideoWindow);
