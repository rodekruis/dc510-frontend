import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { AUTHENTICATED_USER } from '../resolvers';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const { user } = this.props.data;
    this.props.navigation.navigate(user && user.token ? 'App' : 'Auth');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object,
  data: PropTypes.shape({
    user: PropTypes.object
  })
};

export default graphql(AUTHENTICATED_USER)(withNavigation(AuthLoadingScreen));
