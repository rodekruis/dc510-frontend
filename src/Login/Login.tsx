import * as React from 'react';
import { View, Image, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import { Component } from 'react';
import LoginForm from './LoginForm';

export interface AppProps {
}

export default class Login extends Component<AppProps, any> {
  constructor(props: AppProps) {
    super(props);
  }

  public render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../../images/510square.png')} />
            <Text style={styles.title}>Data Collection Application</Text>
        </View>
        <View style={styles.formContainer}>
          <LoginForm />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#FFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 20,
    width: 300,
    fontSize: 20
  },
  logoContainer: {
    marginTop: 100,
    alignItems: 'center',
    flexGrow: 1,
    // justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100
  },
  formContainer: {
    padding: 10,
  },
});
