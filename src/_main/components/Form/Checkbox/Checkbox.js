import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Checkbox = (props) => {
  return (
    <div className="checkbox">
      <input
        id={props.id}
        type="checkbox"
        onChange={props.onChange}
        checked={props.isChecked}
      />
      <label htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool
}

Checkbox.defaultProps = {
  label: '',
  isChecked: false,
  isDisabled: false
}

export default Checkbox;
