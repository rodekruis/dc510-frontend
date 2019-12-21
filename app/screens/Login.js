import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

import { initialState, AUTHENTICATED_USER } from '../resolvers';
import SafeArea from '../components/SafeArea';
import { Stack, Inset } from '../components/Spacing';

// @todo add loading indicator

class LoginScreen extends React.Component {
  state = {
    loading: false,
    email: '',
    password: '',
    error: null
  };

  static navigationOptions = {
    title: 'Login'
  };

  login = async () => {
    const { email, password } = this.state;
    this.setState({ ...this.state, loading: true });
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
    this.setState({ ...this.state, loading: false });
  };

  render() {
    const { error, email, password, loading } = this.state;
    return (
      <SafeArea style={styles.container}>
        <Inset all="huge">
          {error && <Text style={styles.error}>{error}</Text>}
          <Stack size="medium" />
          <Input
            defaultValue={email}
            placeholder="Email"
            autoCapitalize="none"
            autoCompleteType="email"
            onChangeText={email => this.setState({ email, error: null })}
          />
          <Stack size="medium" />
          <Input
            defaultValue={password}
            placeholder="Password"
            autoCompleteType="password"
            secureTextEntry
            onChangeText={password => this.setState({ password, error: null })}
          />
          <Stack size="large" />
          <Button
            title="Login"
            onPress={this.login}
            type="solid"
            loading={loading}
          />
        </Inset>
      </SafeArea>
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
    justifyContent: 'center'
  },
  error: {
    color: 'red'
  }
});
