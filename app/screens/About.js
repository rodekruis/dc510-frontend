import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

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

export default withNavigation(AboutScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
