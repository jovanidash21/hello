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
      name
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

      for ( var i = 0; i < name.length; i++ ) {
        charCodeSum += name.charCodeAt(i);
      }

      const j = charCodeSum % colors.length;

      avatarStyles.backgroundColor = colors[j];
      avatarStyles.fontSize = Math.floor(parseInt(size, 10) / 2.5);
      avatarStyles.lineHeight = size;
    }

    return avatarStyles;
  }
  handleTopBadge(type) {
    const {
      role,
      chatType
    } = this.props;
    var icon = '';
    var title = '';

    if ( role.length > 0 ) {
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
    } else if ( chatType.length > 0 ) {
      switch ( chatType ) {
        case 'public':
          icon = 'users';
          title = 'This is a public chat room';
          break;
        default:
          break;
      }
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
      name,
      role,
      accountType,
      chatType,
      badgeBigger,
      badgeCloser
    } = this.props;
    const avatarStyles = ::this.handleAvatarStyles();
    const nameAbbr = initials(name).substring(0,2);
    const topBadgeIcon = ::this.handleTopBadge('icon');
    const topBadgeTitle = ::this.handleTopBadge('title');
    const bottomBadgeIcon = ::this.handleBottomBadgeIcon();

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
              (role.length > 0 ? role : chatType)
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
  name: PropTypes.string,
  role: PropTypes.string,
  accountType: PropTypes.string,
  chatType: PropTypes.string,
  badgeBigger: PropTypes.bool,
  badgeCloser: PropTypes.bool
}

Avatar.defaultProps = {
  image: '',
  size: '25px',
  name: '',
  role: '',
  accountType: '',
  chatType: '',
  badgeBigger: false,
  badgeCloser: false
}

export default Avatar;
