import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function SafeArea({ style = {}, ...props }) {
  return <SafeAreaView style={{ ...styles.container, ...style }} {...props} />;
}

SafeArea.propTypes = {
  style: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
