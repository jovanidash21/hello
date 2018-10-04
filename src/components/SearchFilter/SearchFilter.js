import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Input } from 'muicss/react';
import './styles.scss';

class SearchFilter extends Component {
  constructor(props) {
    super(props);
  }
  handleClearSearchFilter(event) {
    event.preventDefault();

    const { handleClearSearchFilter } = this.props;

    handleClearSearchFilter();

    this.inputFilter.controlEl.focus();
  }
  render() {
    const {
      value,
      placeholder,
      onChange,
      onKeyDown,
      light
    } = this.props;

    return (
      <div className={"search-filter " + (light ? 'light' : '')}>
        <div className="search-icon">
          <FontAwesome name="search" />
        </div>
        <Input
          value={value}
          type="text"
          autoComplete="off"
          floatingLabel={false}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={(element) => { this.inputFilter = element; }}
        />
        {
          value.length > 0 &&
          <div className="clear-icon" onClick={::this.handleClearSearchFilter}>
            <FontAwesome name="times" />
          </div>
        }
      </div>
    );
  }
}

SearchFilter.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  handleClearSearchFilter: PropTypes.func.isRequired,
  light: PropTypes.bool
}

SearchFilter.defaultProps = {
  value: '',
  placeholder: 'Search',
  onChange: () => {},
  onKeyDown: () => {},
  light: false
}

export default SearchFilter;
