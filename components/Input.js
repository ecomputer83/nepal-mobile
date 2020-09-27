import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import {Block, Input, Text} from "galio-framework";

import Icon from './Icon';
import { nowTheme } from "../constants";

class ArInput extends React.Component {
  render() {
    const { shadowless, noicon, success, error, primary, errorMessage } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless,
      success && styles.success,
      (error || errorMessage) && styles.error,
      primary && styles.primary,
      {...this.props.style}
    ];

    return (
      <Block>
      <Input
        placeholder="write something here"
        placeholderTextColor={nowTheme.COLORS.MUTED}
        style={inputStyles}
        color={nowTheme.COLORS.HEADER}
        iconContent={
          !noicon ? <Icon
            size={14}
            color={nowTheme.COLORS.ICON}
            name="link"
            family="AntDesign"
          /> : null
        }
        {...this.props}
      />
      {(errorMessage) ? (<Text size={10} style={{color: nowTheme.COLORS.INPUT_ERROR, lineHeight: 10}}>
        {errorMessage}
            </Text>) : (<Block />)}
      </Block>
    );
  }
}

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  primary: false
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  primary: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: nowTheme.COLORS.INPUT_SUCCESS
  },
  error: {
    borderColor: nowTheme.COLORS.INPUT_ERROR
  },
  primary: {
    borderColor: nowTheme.COLORS.PRIMARY
  },
  shadow: {
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  }
});

export default ArInput;
