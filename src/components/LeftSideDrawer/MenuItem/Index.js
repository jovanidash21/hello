import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      icon,
      title
    } = this.props;

    return (
      <div className="menu-item">
        <div className="menu-icon">
          <FontAwesome name={icon} size="2x" />
        </div>
        <div className="menu-title">
          {title}
        </div>
      </div>
    )
  }
}

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default MenuItem;
