import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class Avatar extends Component {
  constructor(props) {
    super(props);
  }
  handleTopBadge(type) {
    const { role } = this.props;
    var icon = '';
    var title = '';

    switch ( role ) {
      case 'owner':
        icon = 'shield';
        title = 'This member is an owner';
        break;
      case 'admin':
        icon = 'font';
        title = 'This member is an admin';
        break;
      case 'moderator':
        icon = 'forward';
        title = 'This member is a moderator';
        break;
      default:
        break;
    }

    if ( type === 'icon' ) {
      return icon;
    } else if ( type === 'title' ) {
      return title;
    }
  }
  handleBottomBadgeIcon() {
    const { accountType } = this.props;
    var icon = accountType;

    switch ( accountType ) {
      case 'guest':
        icon = 'star';
        break;
      case 'local':
        icon = '';
      default:
        break;
    }

    return icon;
  }
  render() {
    const {
      image,
      size,
      title,
      role,
      accountType,
      badgeCloser
    } = this.props;
    const topBadgeIcon = ::this.handleTopBadge('icon');
    const topBadgeTitle = ::this.handleTopBadge('title');
    const bottomBadgeIcon = ::this.handleBottomBadgeIcon();

    return (
      <div
        className="avatar"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: size,
          height: size,
          width: size,
          flex: `0 0 ${size}`
        }}
        title={title}
      >
        {
          topBadgeIcon.length > 0 &&
          <div
            className={
              "badge-logo top " +
              (badgeCloser ? 'closer ' : '') +
              role
            }
            title={topBadgeTitle}
          >
            <FontAwesome
              className="icon"
              name={topBadgeIcon}
            />
          </div>
        }
        {
          bottomBadgeIcon.length > 0 &&
          <div
            className={
              "badge-logo " +
              (badgeCloser ? 'closer ' : '') +
              accountType
            }
            title={bottomBadgeIcon}
          >
            <FontAwesome
              className="icon"
              name={bottomBadgeIcon}
            />
          </div>
        }
      </div>
    )
  }
}

Avatar.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.string,
  title: PropTypes.string,
  role: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  badgeCloser: PropTypes.bool
}

Avatar.defaultProps = {
  size: '25px',
  title: '',
  badgeCloser: false
}

export default Avatar;
