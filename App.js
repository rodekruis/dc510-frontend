import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createAppContainer } from 'react-navigation';
import { ActivityIndicator, StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import AppNavigator from './app/navigator';
import SetupApollo from './app/apollo';
import theme from './app/theme';

import ErrorBoundary from './app/components/ErrorBoundary';

const App = createAppContainer(AppNavigator);

// @todo this could be the color palette
// https://coolors.co/558191-273c2c-88ab75-c1666b-939196

export default class Root extends React.Component {
  state = {
    client: null,
    loaded: false
  };

  async componentDidMount() {
    const client = await SetupApollo();
    this.setState({
      client,
      loaded: true
    });
  }

  render() {
    const { client, loaded } = this.state;
    if (!loaded) return <ActivityIndicator />;
    return (
      <ErrorBoundary>
        <ApolloProvider client={client}>
          {/* @todo add networkActivityIndicatorVisible while uploading */}
          <StatusBar hidden={false} barStyle="dark-content" />
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}
