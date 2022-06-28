import { Link, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import db from '~/utils/db.server';
import PageHeader from '~/components/PageHeader';
import { validateValue } from '~/utils';
import { getUser } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title') as string;
  const body = form.get('body') as string;
  const user = await getUser(request);

  if (!user) {
    return;
  }

  const data: TPostCreatePayload = { title, body, userId: user.id };

  const errors = {
    title: validateValue(title, { length: 4 }),
    body: validateValue(body, { length: 10 }),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, data }, { status: 400 });
  }

  try {
    const post = await db.post.create({ data });
    return redirect(`/posts/${post.id}`);
  } catch (error: any) {
    throw new Error(error);
  }
};

const NewPost = () => {
  const actionData = useActionData<TActionData<TPostCreatePayload>>();

  return (
    <div className='container mx-auto'>
      <PageHeader title='Create a Post'>
        <Link to='/posts' className='btn btn--success'>
          Back
        </Link>
      </PageHeader>

      <form
        method='POST'
        className='flex flex-col mt-6 space-y-4 max-w-md mx-auto'
      >
        <div>
          <label>
            <span>Title</span>
            <input
              type='text'
              name='title'
              defaultValue={actionData?.data.title}
              className={actionData?.errors?.title ? 'input-error' : ''}
            />
          </label>
          {actionData?.errors?.title && (
            <small className='text-danger-500'>
              {actionData?.errors?.title}
            </small>
          )}
        </div>
        <div>
          <label>
            <span>Body</span>
            <textarea
              name='body'
              rows={5}
              defaultValue={actionData?.data.body}
              className={
                'resize-none' + (actionData?.errors?.body ? ' input-error' : '')
              }
            />
          </label>
          {actionData?.errors?.body && (
            <small className='text-danger-500'>
              {actionData?.errors?.body}
            </small>
          )}
        </div>
        <button type='submit' className='btn btn--success'>
          Add Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
