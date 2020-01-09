import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { graphql, withApollo } from 'react-apollo';

import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';
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
    // @todo
    // Check if there are any observations to be synced
    // Ask the user if they want to sync before logging out
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
      <SafeArea>
        <Inset all="medium">
          <Text>Hello {user.name}</Text>
          <Stack size="medium" />
          <Text>You are logged in as {user.email}</Text>
          <Stack size="medium" />
          <Button title="Logout" onPress={this.logout} />
        </Inset>
      </SafeArea>
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
