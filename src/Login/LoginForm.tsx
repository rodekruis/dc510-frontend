import React, { Component } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';

export interface AppProps {
}

export interface AppState {
}

const COLOR_510_BLUE = "#4C8294";
const COLOR_510_WHITE = "#F6F0EB";
const COLOR_510_WHITE_TR22 = "#F6F0EB22";
const COLOR_510_WHITE_TR66 = "#F6F0EB66";
const COLOR_510_GREY = "#636363";
const COLOR_RC_RED = "#ED2E26";

export default class LoginForm extends Component<AppProps, AppState> {
  emailinput: TextInput;
  passwordInput: TextInput;

  constructor(props: AppProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
        <View style={styles.container}>
          <StatusBar 
            barStyle="light-content"
          />

          <TextInput 
            ref={(input) => { this.emailinput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
            placeholder="email"
            placeholderTextColor={COLOR_510_WHITE_TR66}
            returnKeyType="next"
            returnKeyLabel="next"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />        
          <TextInput 
            ref={(input) => { this.passwordInput = input; }}
            placeholder="password"
            placeholderTextColor={COLOR_510_WHITE_TR66}
            returnKeyType="send"
            returnKeyLabel="send"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      padding: 10
    },
    input: { 
      height: 40,
      fontSize: 15,
      letterSpacing: 1,
      backgroundColor: COLOR_510_WHITE_TR22,
      marginBottom: 10,
      color: COLOR_510_WHITE,
      paddingHorizontal: 10,
      width: 300,
      borderRadius: 3,
    },
    buttonContainer: {
      backgroundColor: COLOR_510_WHITE,
      paddingVertical: 15,
      textAlign: 'center',
      borderRadius: 3,
    },
    buttonText: {
      textAlign: 'center',
      color: COLOR_510_BLUE,
      fontWeight: '700',
      fontSize: 16
    },
  });
