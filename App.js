import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createAppContainer } from 'react-navigation';
import { ActivityIndicator, StyleSheet, View, Button } from 'react-native';
import AppNavigator from './app/navigator';
import ErrorBoundary from './app/components/ErrorBoundary';
import SetupApollo from './app/apollo';

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

  clearData = async () => {
    const { client } = this.state;
    await client.resetStore();
  };

  render() {
    const { client, loaded } = this.state;
    if (!loaded) return <ActivityIndicator />;
    return (
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <App />
          <View style={styles.bottom}>
            <Button title="Clear data" onPress={this.clearData} />
          </View>
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
