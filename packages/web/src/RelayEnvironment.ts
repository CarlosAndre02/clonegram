import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction
} from 'relay-runtime';

const HTTP_ENDPOINT = import.meta.env.VITE_API_BASE_URL;

const fetchRelay: FetchFunction = async (
  query,
  variables,
  cacheConfig,
  uploadables
) => {
  const headers: any = {};
  let body: any = {};

  if (uploadables) {
    if (!window.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }

    const formData = new FormData();

    const queryText = query?.text?.replace(/\n/g, '');
    const operations = JSON.stringify({
      query: queryText,
      variables
    });
    formData.append('operations', operations);

    // For now, supports only 1 upload, named as 'file'
    const map = {
      0: [`variables.input.file`]
    };
    formData.append('map', JSON.stringify(map));
    formData.append('0', uploadables['file']);

    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      query: query.text,
      variables
    });
  }

  // if (token) {
  //   headers['Authorization'] = `Bearer <token>`;
  // }

  const request = {
    method: 'POST',
    headers,
    body
  };

  const resp = await fetch(HTTP_ENDPOINT, request);

  return resp.json();
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchRelay),
    store: new Store(new RecordSource())
  });
}

export const RelayEnvironment = createRelayEnvironment();
