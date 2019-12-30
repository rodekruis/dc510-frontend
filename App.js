import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createAppContainer } from 'react-navigation';
import { ActivityIndicator, StatusBar } from 'react-native';
import AppNavigator from './app/navigator';
import SetupApollo from './app/apollo';

import ErrorBoundary from './app/components/ErrorBoundary';

const App = createAppContainer(AppNavigator);

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
          <App />
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}
