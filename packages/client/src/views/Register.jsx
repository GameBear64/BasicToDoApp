import { Link, useNavigate } from 'react-router-dom';

import { ConfirmField, Input } from '@form/Fields';
import Form from '@form/Form';
import { MAX_LENGTH, MIN_LENGTH, REQUIRED } from '@form/validations';

import useFetch from '@tools/useFetch';
import { successSnackBar } from '@tools/snackbars';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = data => {
    useFetch({ url: 'auth/register', method: 'POST', body: data, requireAuth: false }).then(() => {
      successSnackBar('Welcome!');
      navigate(`/`);
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-base px-6 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold leading-9">Create a new account</h2>
        <p className="max-w mt-2 text-center text-sm leading-5">
          Or
          <Link className="ml-1" to="/login">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 bg-base-x px-4 py-8 shadow sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:px-10">
        <Form onSubmit={handleRegister}>
          <Input
            placeholder="Jon Doe"
            name="name"
            label="Name"
            rules={{
              ...REQUIRED,
              ...MIN_LENGTH(3),
              ...MAX_LENGTH(30),
            }}
          />
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
          <ConfirmField
            type="password"
            name="confirmPassword"
            sameAs="password"
            label="Confirm Password"
            placeholder="●●●●●●●●●●"
            autoComplete="on"
            rules={{
              ...REQUIRED,
              ...MIN_LENGTH(8),
            }}
          />
          <button type="submit" className="button mt-5 w-full">
            Register
          </button>
        </Form>
      </div>
    </div>
  );
}
