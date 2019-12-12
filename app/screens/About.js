import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About'
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>About screen</Text>
      </View>
    );
  }
}

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
