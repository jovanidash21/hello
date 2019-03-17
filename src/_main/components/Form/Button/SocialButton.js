import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'muicss/react';
import FontAwesome from 'react-fontawesome';

const SocialButton = (props) => {
  return (
    <Button
      className={`button button-social button-${props.socialMedia}`}
      size="large"
      variant="raised"
      onClick={props.handleSocialLogin}
      disabled={props.disabled}
    >
      <div className="social-icon">
        <FontAwesome name={props.socialMedia} size="2x" />
      </div>
      {props.label}
    </Button>
  );
}

SocialButton.propTypes = {
  socialMedia: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleSocialLogin: PropTypes.func,
  disabled: PropTypes.bool
}

SocialButton.defaultProps = {
  handleSocialLogin: () => {},
  disabled: false
}

export default SocialButton;
