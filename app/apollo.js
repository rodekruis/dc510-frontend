import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import store from './store';

const env = {
  dev: 'http://localhost:3000/admin/api',
  staging: 'https://dc510-staging.herokuapp.com/admin/api'
};

const API_ENDPOINT = __DEV__ ? env.dev : env.staging; // eslint-disable-line

const httpLink = createHttpLink({ uri: API_ENDPOINT });

const middlewareLink = new ApolloLink((operation, forward) => {
  const state = store.getState();
  const { user } = state;
  const authorizationHeader = user ? `Bearer ${user.token}` : null;
  if (user) {
    operation.setContext({
      headers: {
        Authorization: authorizationHeader
      }
    });
  }
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

export default client;
