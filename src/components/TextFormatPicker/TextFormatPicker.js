import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'muicss/react';
import FontAwesome from 'react-fontawesome';
import './styles.scss';

class TextFormatPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontStyle: 'normal'
    };
  }
  handleFontStyle(event, fontStyle) {
    event.preventDefault();

    const { handleFontStyle } = this.props;

    handleFontStyle(fontStyle);
  }
  render() {
    const { fontStyle } = this.props;

    return (
      <div className="text-format-picker">
        <Button
          className={"button " + (fontStyle === 'bold' ? 'button-primary' : 'button-default')}
          size="small"
          title="Bold"
          onClick={(e) => {::this.handleFontStyle(e, 'bold')}}
        >
          <b>B</b>
        </Button>
        <Button
          className={"button " + (fontStyle === 'italic' ? 'button-primary' : 'button-default')}
          size="small"
          title="Italic"
          onClick={(e) => {::this.handleFontStyle(e, 'italic')}}
        >
          <i>I</i>
        </Button>
        <Button
          className={"button " + (fontStyle === 'strike' ? 'button-primary' : 'button-default')}
          size="small"
          title="Strike"
          onClick={(e) => {::this.handleFontStyle(e, 'strike')}}
        >
          <strike>S</strike>
        </Button>
      </div>
    )
  }
}

TextFormatPicker.propTypes = {
  fontStyle: PropTypes.string,
  handleFontStyle: PropTypes.func.isRequired
}

TextFormatPicker.defautProps = {
  fontStyle: 'normal'
}

export default TextFormatPicker;
