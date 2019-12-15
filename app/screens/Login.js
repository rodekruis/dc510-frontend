import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import compose from 'lodash.flowright';
import { authenticate } from '../reducers/user';

class LoginScreen extends React.Component {
  state = {
    email: '',
    password: ''
  };

  static navigationOptions = {
    title: 'Login'
  };

  login = async () => {
    const { data } = await this.props.authenticate({
      variables: this.state
    });
    const { token, user } = data.authenticateUserWithPassword;
    this.props.dispatch(authenticate({ token, ...user }));
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login screen</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          onChangeText={password => this.setState({ password })}
        />
        <Button title="Login" onPress={this.login} />
      </View>
    );
  }
}

LoginScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  authenticate: PropTypes.func
};

const AUTH_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      token
      user: item {
        id
        name
        email
      }
    }
  }
`;

export default connect()(
  withNavigation(
    compose(graphql(AUTH_MUTATION, { name: 'authenticate' }))(LoginScreen)
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
