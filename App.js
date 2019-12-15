import React from 'react';
import { Provider, connect } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './app/store';
import AppNavigator from './app/navigator';

const App = createReduxContainer(AppNavigator);
const mapStateToProps = state => ({
  state: state.nav
});
const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppWithNavigationState />
        </PersistGate>
      </Provider>
    );
  }
}
