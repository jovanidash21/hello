import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'muicss/react';

const GuestButton = (props) => {
  if ( props.link.length > 0 ) {
    return (
      <Link
        to={props.link}
        className={
          "mui-btn mui-btn--raised mui-btn--large button button-guest " +
          (props.isDisabled ? 'disabled' : '')
        }
      >
        Guest Login
      </Link>
    )
  } else {
    return (
      <Button
        className='button button-guest'
        size="large"
        type="submit"
        variant="raised"
        disabled={props.isDisabled}
      >
        Guest Login
      </Button>
    )
  }
}

GuestButton.propTypes = {
  link: PropTypes.string,
  isDisabled: PropTypes.bool
}

GuestButton.defaultProps = {
  link: '',
  isDisabled: false
}

export default GuestButton;
