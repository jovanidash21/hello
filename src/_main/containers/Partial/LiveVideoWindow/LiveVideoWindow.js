import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import mapDispatchToProps from '../../../actions';
import { isObjectEmpty } from '../../../../utils/object';
import { Avatar } from '../../../../components/Avatar';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import './styles.scss';

class LiveVideoWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'restore'
    };
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.loading && !this.props.loading ) {
      ::this.handleLiveVideoSource();
    }
  }
  componentWillUnmount() {
    if ( this.liveVideo && this.liveVideo.srcObject ) {
      this.liveVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  handleLiveVideoSource() {
    const {
      user,
      liveVideoUser
    } = this.props;
    const activeUser = user.active;

    if ( !isObjectEmpty(liveVideoUser.video.source) ) {
      this.liveVideo.srcObject = liveVideoUser.video.source;

      if ( activeUser._id === liveVideoUser._id ) {
        this.liveVideo.muted = true;
      }
    }
  }
  handleActiveLiveVideoWindow(event) {
    event.preventDefault();

    const {
      index,
      handleActiveLiveVideoWindow
    } = this.props;

    handleActiveLiveVideoWindow(index);
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
      liveVideoUser,
      active,
      loading
    } = this.props;
    const { display } = this.state;
    const activeUser = user.active;

    return (
      <Draggable bounds="parent" handle=".popup-header" onDrag={::this.handleActiveLiveVideoWindow}>
        <div
          className={
            "live-video-window " +
            display + ' ' +
            (active ? 'active ' : '')
          }
        >
          <div className="popup-header" onClick={::this.handleActiveLiveVideoWindow}>
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
            {
              loading &&
              <LoadingAnimation name="ball-clip-rotate" color="white" />
            }
            {
              !loading &&
              <video
                className="live-video"
                ref={(element) => { this.liveVideo = element; }}
                autoPlay
              />
            }
          </div>
        </div>
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

LiveVideoWindow.propTypes = {
  index: PropTypes.number.isRequired,
  liveVideoUser: PropTypes.object.isRequired,
  handleActiveLiveVideoWindow: PropTypes.func.isRequired,
  handleEndLiveVideo: PropTypes.func.isRequired,
  active: PropTypes.bool,
  loading: PropTypes.bool
}

LiveVideoWindow.defaultProps = {
  active: false,
  loading: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveVideoWindow);
