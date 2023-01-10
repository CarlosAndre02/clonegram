import { FetchFunction } from 'relay-runtime';

import { getToken } from '@/modules/auth/localStorage';

const HTTP_ENDPOINT = import.meta.env.VITE_API_BASE_URL;

export const fetchGraphQL: FetchFunction = async (
  query,
  variables,
  cacheConfig,
  uploadables
) => {
  const userToken = getToken();

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

  if (userToken?.accessToken) {
    headers['authorization'] = `Bearer ${userToken.accessToken}`;
  }

  const request = {
    method: 'POST',
    headers,
    body
  };

  const resp = await fetch(HTTP_ENDPOINT, request);
  return await resp.json();
};
