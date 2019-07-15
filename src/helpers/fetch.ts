import HttpError from './HttpError';

const fetchJson = async (url, options: any = {}) => {
  const requestHeaders =
    options.headers ||
    new Headers({
      Accept: 'application/json',
    });
  if (!(options && options.body && options.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      }))
    )
    .then(async response => {
      const { status, statusText, headers, body } = response;
      console.log(`${url} returned`, response, status, statusText, headers, body);
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
        console.log(`${url} response: body is not a well-formatted JSON object`);
      }
      if (status < 200 || status >= 300) {
        console.error('Fetch failed', status, body, json);
        const err = new HttpError(status, body, json);
        return Promise.reject(err);
      }
      return { status, headers, body, json };
    });
  // .catch(error => {
  //   console.log('Fetch Error:', error);
  //   return Promise.reject(new HttpError(error.message, 0, {}));
  // });
};

export default fetchJson;
