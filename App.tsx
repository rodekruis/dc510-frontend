import React from 'react';
import { StyleSheet, Image, Text, View, TouchableWithoutFeedback, TextInput } from 'react-native';
import Login from './src/Login/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C8294',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
