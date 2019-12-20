import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { initialState, AUTHENTICATED_USER } from '../resolvers';

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
      this.props.navigation.navigate('App');
    } catch (e) {
      console.log(e);
      this.setState({ error: 'Incorrect username or password' });
    }
  };

  render() {
    const { error, email, password } = this.state;
    return (
      <View style={styles.container}>
        <Text>Login screen</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          defaultValue={email}
          placeholder="Email"
          autoCapitalize="none"
          autoCompleteType="email"
          onChangeText={email => this.setState({ email, error: null })}
        />
        <TextInput
          defaultValue={password}
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

const AUTHENTICATE_USER = gql`
  mutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      token
      item {
        id
        name
        email
      }
    }
  }
`;

export default graphql(AUTHENTICATE_USER, {
  name: 'authenticate',
  options: {
    // Update local state after login
    update: (proxy, { data: { authenticateUserWithPassword } }) => {
      const { token, item } = authenticateUserWithPassword;
      const data = {
        ...initialState,
        user: { ...item, token }
      };
      proxy.writeQuery({ query: AUTHENTICATED_USER, data });
    }
  }
})(withNavigation(LoginScreen));

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
