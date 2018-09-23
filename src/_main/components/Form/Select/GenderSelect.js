import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'muicss/react';

const GenderSelect = (props) => {
  return (
    <Select
      defaultValue={props.defaultGender}
      label="Gender"
      required={true}
      onChange={props.onGenderChange}
      disabled={props.isDisabled}
    >
      <Option value="male" label="Male" />
      <Option value="female" label="Female" />
    </Select>
  );
}

GenderSelect.propTypes = {
  defaultGender: PropTypes.string,
  onGenderChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

GenderSelect.defaultProps = {
  defaultGender: '',
  isDisabled: false
}

export default GenderSelect;
