import { errorSnackBar } from '@tools/snackbars';

const baseURL = `${origin}/api`;

export default function useFetch({ url, method, body }) {
  const options = {
    method,
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  };

  return fetch(`${baseURL}/${url}`, options)
    .then(async res => {
      const data = await res.text().then(text => (text ? JSON.parse(text) : null));

      if (!res.ok) return Promise.reject(data || res?.status);
      return data;
    })
    .catch(error => {
      errorSnackBar(error);
      return Promise.reject(error);
    });
}
