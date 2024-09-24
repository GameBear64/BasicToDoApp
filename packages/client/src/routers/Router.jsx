import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import useFetch from '@tools/useFetch';
import { setUser } from '@store/user';

import Layout from '@components/Layout/Layout';

// const TaskView = lazy(() => import('../views/TaskView'));
const Home = lazy(() => import('../views/Home'));
const Workspace = lazy(() => import('../views/Workspace'));
const Login = lazy(() => import('../views/Login'));
const Register = lazy(() => import('../views/Register'));

import ErrorPage from './static/ErrorPage';
import NotFound from './static/NotFound';
import Loader from './static/Loader';

let router;

export default function Router() {
  router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          loader: async () => {
            await useFetch({ url: 'user', noError: true }).then(data => {
              setUser(data.id);
            });

            return null;
          },
          children: [
            {
              path: '/',
              element: (
                <Suspense fallback={<Loader />}>
                  <Home />
                </Suspense>
              ),
              errorElement: <ErrorPage />,
            },
            {
              path: '/wp/:id/:view?',
              element: (
                <Suspense fallback={<Loader />}>
                  <Workspace />
                </Suspense>
              ),
              errorElement: <ErrorPage />,
            },
          ],
        },
        {
          path: '/register',
          element: (
            <Suspense fallback={<Loader />}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: '/login',
          element: (
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          ),
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export { router };
