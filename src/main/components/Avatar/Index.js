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
      title
    } = this.props;
    var avatarStyles = {
      height: size,
      width: size,
      flex: `0 0 ${size}`
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
      var charCodeSum = 0;

      for ( var i = 0; i < title.length; i++ ) {
        charCodeSum += title.charCodeAt(i);
      }

      const j = charCodeSum % colors.length;

      avatarStyles.backgroundColor = colors[j];
      avatarStyles.fontSize = Math.floor(parseInt(size, 10) / 2.5);
      avatarStyles.lineHeight = size;
    }

    return avatarStyles;
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
    const avatarStyles = ::this.handleAvatarStyles();
    const nameAbbr = initials(title).substring(0,2);
    const topBadgeIcon = ::this.handleTopBadge('icon');
    const topBadgeTitle = ::this.handleTopBadge('title');
    const bottomBadgeIcon = ::this.handleBottomBadgeIcon();

    return (
      <div
        className="avatar"
        style={avatarStyles}
        title={title}
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
            title={accountType}
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
  title: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  badgeCloser: PropTypes.bool
}

Avatar.defaultProps = {
  image: '',
  size: '25px',
  badgeCloser: false
}

export default Avatar;
