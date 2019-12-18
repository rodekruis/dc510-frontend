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
    password: '',
    error: null
  };

  static navigationOptions = {
    title: 'Login'
  };

  login = async () => {
    const { email, password } = this.state;
    try {
      const { data } = await this.props.authenticate({
        variables: { email, password }
      });
      if (data.error) throw data.error;
      const { token, user } = data.authenticateUserWithPassword;
      this.props.dispatch(authenticate({ token, ...user }));
      this.props.navigation.navigate('App');
    } catch (e) {
      this.setState({ error: 'Incorrect username or password' });
    }
  };

  render() {
    const { error } = this.state;
    return (
      <View style={styles.container}>
        <Text>Login screen</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          autoCompleteType="email"
          onChangeText={email => this.setState({ email, error: null })}
        />
        <TextInput
          placeholder="Password"
          autoCompleteType="password"
          secureTextEntry
          onChangeText={password => this.setState({ password, error: null })}
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
  },
  error: {
    color: 'red'
  }
});
