import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import PageHeader from '~/components/PageHeader';
import { validateValue } from '~/utils';
import { createUserSession, signin } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  const data: TSigninPayload = { username, password };

  const errors = {
    username: validateValue(username, { length: 4 }),
    password: validateValue(password, { length: 7 }),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, data }, { status: 400 });
  }

  try {
    const user = await signin({ username, password });

    if (!user) {
      return json(
        {
          errors: {
            username: 'Invalid Credentials',
          },
          data,
        },
        { status: 400 }
      );
    }

    return createUserSession(user.id, '/posts');
  } catch (error: any) {
    throw new Error(error);
  }
};

const Signin = () => {
  const actionData = useActionData<TActionData<TSigninPayload>>();

  return (
    <div className='container mx-auto'>
      <div className='max-w-md mx-auto min-h-content flex justify-center flex-col'>
        <PageHeader title='Sign in'>
          <Link to='/auth/signup' className='btn btn--success'>
            Signup
          </Link>
        </PageHeader>

        <form method='POST' className='flex flex-col mt-6 space-y-4'>
          <div>
            <label>
              <span>Username</span>
              <input
                type='text'
                name='username'
                defaultValue={actionData?.data.username}
                className={actionData?.errors?.username ? 'input-error' : ''}
              />
            </label>
            {actionData?.errors?.username && (
              <small className='text-danger-500'>
                {actionData?.errors?.username}
              </small>
            )}
          </div>
          <div>
            <label>
              <span>Password</span>
              <input
                type='password'
                name='password'
                defaultValue={actionData?.data.password}
                className={actionData?.errors?.password ? ' input-error' : ''}
              />
            </label>
            {actionData?.errors?.password && (
              <small className='text-danger-500'>
                {actionData?.errors?.password}
              </small>
            )}
          </div>
          <button type='submit' className='btn btn--success'>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
