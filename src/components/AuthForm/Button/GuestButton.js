import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'muicss/react';

const GuestButton = (props) => {
  return (
    <div>
      {
        ((props.type === '') && (!props.isDisabled))
          ?
          <Link to="/guest">
            <Button
              className='button button-guest'
              size="large"
              variant="raised"
              disabled={false}
            >
              Enter as guest
            </Button>
          </Link>
          :
          <Button
            className='button button-guest'
            size="large"
            type={props.type}
            variant="raised"
            disabled={props.isDisabled}
          >
            Enter as guest
          </Button>
      }
    </div>
  );
}

GuestButton.propTypes = {
  type: PropTypes.string,
  isDisabled: PropTypes.bool
}

GuestButton.defaultProps = {
  type: '',
  isDisabled: false
}

export default GuestButton;
