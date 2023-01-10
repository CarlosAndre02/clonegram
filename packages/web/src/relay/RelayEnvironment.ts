import { Environment, Network, RecordSource, Store } from 'relay-runtime';

import { fetchGraphQL } from './fetchGraphQL';

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchGraphQL),
    store: new Store(new RecordSource())
  });
}

export const RelayEnvironment = createRelayEnvironment();
