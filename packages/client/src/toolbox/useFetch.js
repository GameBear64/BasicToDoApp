import { errorSnackBar } from '@tools/snackbars';
import { router } from '../routers/Router';

const baseURL = `${origin}/api`;
const doNotRedirectFrom = ['/login', '/register'];

export default function useFetch({ url, method, body, noError } = { noError: true }) {
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

      if (res.status === 401) {
        if (!doNotRedirectFrom.includes(router.state.location.pathname)) {
          router.navigate('/login');
          window.location.reload();
        }
      }

      if (!res.ok) return Promise.reject(data || res?.status);
      return data;
    })
    .catch(error => {
      if (noError) return;
      errorSnackBar(error);
      return Promise.reject(error);
    });
}
