import { AsyncStorage } from 'react-native';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { CachePersistor } from 'apollo-cache-persist';
import resolvers, { initialState, AUTHENTICATED_USER } from './resolvers';
import { isDev, API_HOST } from './constants';

const API_ENDPOINT = API_HOST + '/admin/api';

// Support schema migrations https://git.io/Je58A
const SCHEMA_VERSION = '1'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

// Apollo config
const cache = new InMemoryCache();
const config = {
  uri: API_ENDPOINT,
  cache,
  request: async operation => {
    // Append Authorization header to requests
    try {
      const { user } = cache.readQuery({
        query: AUTHENTICATED_USER
      });
      operation.setContext({
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
    } catch (e) {
      console.log('Cannot set Authorization header', e);
    }
  },
  resolvers
};

// Init data function
const initData = () => cache.writeData({ data: initialState });

// Setup apollo
export default async function SetupApollo() {
  const client = new ApolloClient(config);
  const persistor = new CachePersistor({
    cache,
    storage: AsyncStorage,
    debug: isDev
  });

  // Read the current schema version from AsyncStorage.
  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    // If the current version matches the latest version,
    // we're good to go and can restore the cache.
    await persistor.restore();
  } else {
    // Otherwise, we'll want to purge the outdated persisted cache
    // and mark ourselves as having updated to the latest version.
    await persistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }

  client.onResetStore(async () => initData());
  return client;
}
