import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import initials from 'initials';
import './styles.scss';

class Avatar extends Component {
  constructor(props) {
    super(props);
  }
  handleAvatarStyles() {
    const {
      image,
      size,
      name,
    } = this.props;
    const avatarStyles = {
      height: size,
      width: size,
      flex: `0 0 ${size}`,
    };
    const colors = [
      '#f85f0d', // blaze orange
      '#57d006', // bright green
      '#304ffe', // blue ribbon
      '#e53935', // cinnabar
      '#d500f9', // electric violet
      '#f05247', // flamingo
      '#4a148c', // persian indigo
      '#f50057', // razzmatazz
      '#2e7d32', // sea green
      '#0d47a1', // tory blue
    ];

    if ( image.length > 0 ) {
      avatarStyles.backgroundImage = `url(${image})`,
      avatarStyles.backgroundSize = size;
    } else {
      let charCodeSum = 0;

      if ( name && name.length > 0 ) {
        for ( let i = 0; i < name.length; i += 1 ) {
          charCodeSum += name.charCodeAt(i);
        }
      }

      const j = charCodeSum % colors.length;

      avatarStyles.backgroundColor = colors[j];
      avatarStyles.fontSize = Math.floor(parseInt(size, 10) / 2.5);
      avatarStyles.lineHeight = size;
    }

    return avatarStyles;
  }
  handleTopBadge(type='icon') {
    const { roleChatType } = this.props;
    let icon = '';
    let title = '';

    switch ( roleChatType ) {
      case 'owner':
        icon = 'shield';
        title = 'This user is an owner';
        break;
      case 'admin':
        icon = 'font';
        title = 'This user is an admin';
        break;
      case 'moderator':
        icon = 'forward';
        title = 'This user is a moderator';
        break;
      case 'public':
        icon = 'users';
        title = 'This is a public chat room';
        break;
      default:
        break;
    }

    if ( type === 'title' ) {
      return title;
    }
    return icon;
  }
  handleBottomBadge(type='icon') {
    const { accountType } = this.props;
    let icon = '';
    let title = '';

    switch ( accountType ) {
      case 'facebook':
        icon = 'facebook';
        title = 'Facebook';
        break;
      case 'google':
        icon = 'google';
        title = 'Google';
        break;
      case 'twitter':
        icon = 'twitter';
        title = 'Twitter';
        break;
      case 'instagram':
        icon = 'instagram';
        title = 'Instagram';
        break;
      case 'linkedin':
        icon = 'linkedin';
        title = 'LinkedIn'
        break;
      case 'github':
        icon = 'github';
        title = 'GitHub';
        break;
      case 'guest':
        icon = 'star';
        title = 'Guest';
        break;
      default:
        break;
    }

    if ( type === 'title' ) {
      return title;
    }
    return icon;
  }
  render() {
    const {
      image,
      size,
      name,
      roleChatType,
      accountType,
      badgeBigger,
      badgeCloser,
    } = this.props;
    const avatarStyles = ::this.handleAvatarStyles();
    const nameAbbr = initials(name).substring(0,2);
    const topBadgeIcon = ::this.handleTopBadge();
    const topBadgeTitle = ::this.handleTopBadge('title');
    const bottomBadgeIcon = ::this.handleBottomBadge();
    const bottomBadgeTitle = ::this.handleBottomBadge('title');

    return (
      <div
        className="avatar"
        style={avatarStyles}
        title={name}
      >
        {
          image.length === 0 &&
          nameAbbr
        }
        {
          topBadgeIcon.length > 0 &&
          <div
            className={
              "badge-logo top " +
              (badgeBigger ? 'bigger ' : '') +
              (badgeCloser ? 'closer ' : '') +
              roleChatType
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
              (badgeBigger ? 'bigger ' : '') +
              (badgeCloser ? 'closer ' : '') +
              accountType
            }
            title={bottomBadgeTitle}
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
  image: PropTypes.string,
  size: PropTypes.string,
  name: PropTypes.string,
  roleChatType: PropTypes.string,
  accountType: PropTypes.string,
  badgeBigger: PropTypes.bool,
  badgeCloser: PropTypes.bool,
}

Avatar.defaultProps = {
  image: '',
  size: '25px',
  name: '',
  roleChatType: '',
  accountType: '',
  badgeBigger: false,
  badgeCloser: false,
}

export default Avatar;
