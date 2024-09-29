import { Link, useNavigate } from 'react-router-dom';

import Form from '@form/Form';
import { Input } from '@form/Fields';
import { MIN_LENGTH, REQUIRED } from '@form/validations';

import useFetch from '@tools/useFetch';
import { successSnackBar } from '@tools/snackbars';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = data => {
    useFetch({ url: 'auth/login', method: 'POST', body: data, requireAuth: false }).then(() => {
      successSnackBar('Welcome back!');
      navigate(`/`);
    });
  };

  return (
    <div className="flex h-full flex-col justify-center px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold leading-9">Sign in to your account</h2>
        <p className="max-w mt-2 text-center text-sm leading-5">
          Or
          <Link className="ml-1" to="/register">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 bg-base-x px-4 py-8 shadow sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:px-10">
        <Form onSubmit={handleLogin}>
          <Input type="email" placeholder="email@ac.com" name="email" label="Email" rules={REQUIRED} />
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="●●●●●●●●●●"
            autoComplete="on"
            rules={{
              ...REQUIRED,
              ...MIN_LENGTH(8),
            }}
          />
          <button type="submit" className="button mt-5 w-full">
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
