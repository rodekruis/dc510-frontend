import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { graphql, withApollo } from 'react-apollo';
import { AUTHENTICATED_USER } from '../resolvers';

class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile'
  };

  _logout = async () => {
    const {
      client,
      navigation: { navigate }
    } = this.props;
    await client.resetStore();
    navigate('Auth');
  };

  logout = () => {
    Alert.alert(
      'Are you sure you want to logout?',
      'Logging out will erase all the data you have collected so far',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'Logout', onPress: this._logout }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { user } = this.props.data;
    if (!user) return null;
    return (
      <View style={styles.container}>
        <Text>Hello {user.name}</Text>
        <Text>You are logged in as {user.email}</Text>
        <Button title="Logout" onPress={this.logout} />
      </View>
    );
  }
}

Profile.propTypes = {
  navigation: PropTypes.object,
  client: PropTypes.object,
  data: PropTypes.shape({
    user: PropTypes.object
  })
};

export default graphql(AUTHENTICATED_USER)(withApollo(withNavigation(Profile)));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
