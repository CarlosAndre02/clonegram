import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction
} from 'relay-runtime';

const HTTP_ENDPOINT = import.meta.env.VITE_API_BASE_URL;

const fetchRelay: FetchFunction = async (request, variables) => {
  const resp = await fetch(HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: request.text,
      variables
    })
  });

  return await resp.json();
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchRelay),
    store: new Store(new RecordSource())
  });
}

export const RelayEnvironment = createRelayEnvironment();
