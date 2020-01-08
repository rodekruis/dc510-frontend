import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

import { AUTHENTICATED_USER } from '../resolvers';
import SafeArea from '../components/SafeArea';
import { Stack, Inset } from '../components/Spacing';
import logo from '../../assets/icon.png';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.passwordField = React.createRef();
  }

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
      this.setState({
        ...this.state,
        error: 'Incorrect username or password',
        loading: false
      });
    }
  };

  render() {
    const { error, email, password, loading } = this.state;
    return (
      <SafeArea style={styles.container}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          keyboardVerticalOffset={100}>
          <Inset all="huge">
            <View style={styles.centerAlign}>
              <Image source={logo} />
              <Stack size="large" />
              {error && <Text style={styles.error}>{error}</Text>}
            </View>
            <Stack size="medium" />
            <Input
              defaultValue={email}
              placeholder="Email"
              autoCapitalize="none"
              autoCompleteType="email"
              containerStyle={styles.inputContainer}
              returnKeyType="next"
              onSubmitEditing={() => this.passwordField.current.focus()}
              onChangeText={email => this.setState({ email, error: null })}
              keyboardType="email-address"
            />
            <Stack size="medium" />
            <Input
              defaultValue={password}
              placeholder="Password"
              autoCompleteType="password"
              containerStyle={styles.inputContainer}
              returnKeyType="go"
              onSubmitEditing={this.login}
              secureTextEntry
              onChangeText={password =>
                this.setState({ password, error: null })
              }
              ref={this.passwordField}
            />
            <Stack size="large" />
            <Button
              title="Login"
              onPress={this.login}
              type="solid"
              loading={loading}
            />
          </Inset>
        </KeyboardAvoidingView>
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
  centerAlign: {
    alignItems: 'center'
  },
  error: {
    color: 'red'
  },
  inputContainer: {
    paddingHorizontal: 0
  }
});
