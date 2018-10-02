import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'muicss/react';

const GenderSelect = (props) => {
  return (
    <Select
      defaultValue={props.defaultValue}
      label={props.label}
      required={true}
      name={props.name}
      onChange={props.onChange}
      disabled={props.disabled}
    >
      {
        props.options.length > 0 &&
        props.options.map((option, i) =>
          <Option
            key={i}
            value={option.value}
            label={option.label}
          />
        )
      }
    </Select>
  );
}

GenderSelect.propTypes = {
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

GenderSelect.defaultProps = {
  options: [],
  defaultValue: '',
  label: '',
  name: '',
  onChange: () => {},
  disabled: false
}

export default GenderSelect;
