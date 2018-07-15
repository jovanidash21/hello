import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import SubMenuItem from './SubMenuItem';
import './styles.scss';

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      icon,
      title,
      children
    } = this.props;

    return (
      <div className="menu-item-wrapper">
        <div className="menu-item">
          <div className="menu-icon">
            <FontAwesome name={icon} size="2x" />
          </div>
          <div className="menu-title">
            {title}
          </div>
          <div className="arrow-icon">
            <FontAwesome name="angle-down" />
          </div>
        </div>
        {children}
      </div>
    )
  }
}

MenuItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string
}

MenuItem.defaultProps = {
  icon: 'flag',
  title: 'Menu Item'
}

MenuItem.SubMenuItem = SubMenuItem;

export default MenuItem;
