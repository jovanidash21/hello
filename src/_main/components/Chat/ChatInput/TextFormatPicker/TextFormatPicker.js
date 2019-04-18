import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { Button } from 'muicss/react';
import './styles.scss';

class TextFormatPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPicker: false
    };
  }
  handleColorPickerToggle(event) {
    event.preventDefault();

    this.setState({colorPicker: !this.state.colorPicker});
  }
  handleTextColor(color) {
    const { handleTextColor } = this.props;

    handleTextColor(color.hex);
  }
  handleTextStyle(event, textStyle) {
    event.preventDefault();

    const { handleTextStyle } = this.props;

    handleTextStyle(textStyle);
  }
  render() {
    const {
      textColor,
      textStyle
    } = this.props;
    const { colorPicker } = this.state;

    return (
      <div className="text-format-picker">
        {
          colorPicker &&
          <div className="color-picker">
            <SketchPicker
              color={textColor}
              onChangeComplete={::this.handleTextColor}
              disableAlpha
            />
          </div>  
        }
        <Button
          className="button"
          size="small"
          title="Color"
          onClick={::this.handleColorPickerToggle}
          style={{backgroundColor: textColor}}
        />
        <Button
          className={"button " + (textStyle === 'bold' ? 'button-primary' : 'button-default')}
          size="small"
          title="Bold"
          onClick={(e) => {::this.handleTextStyle(e, 'bold')}}
        >
          <b>B</b>
        </Button>
        <Button
          className={"button " + (textStyle === 'italic' ? 'button-primary' : 'button-default')}
          size="small"
          title="Italic"
          onClick={(e) => {::this.handleTextStyle(e, 'italic')}}
        >
          <i>I</i>
        </Button>
        <Button
          className={"button " + (textStyle === 'strike' ? 'button-primary' : 'button-default')}
          size="small"
          title="Strike"
          onClick={(e) => {::this.handleTextStyle(e, 'strike')}}
        >
          <strike>S</strike>
        </Button>
      </div>
    )
  }
}

TextFormatPicker.propTypes = {
  textColor: PropTypes.string,
  textStyle: PropTypes.string,
  handleTextColor: PropTypes.func.isRequired,
  handleTextStyle: PropTypes.func.isRequired
}

TextFormatPicker.defautProps = {
  textColor: '#000000',
  textStyle: 'normal'
}

export default TextFormatPicker;
