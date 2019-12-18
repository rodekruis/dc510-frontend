import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider, connect } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './app/store';
import AppNavigator from './app/navigator';
import apollo from './app/apollo';
import ErrorBoundary from './app/components/ErrorBoundary';

const App = createReduxContainer(AppNavigator);
const mapStateToProps = state => ({
  state: state.nav
});
const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <ApolloProvider client={apollo}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppWithNavigationState />
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}
