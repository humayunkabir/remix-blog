import { useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import db from '~/utils/db.server';
import PageHeader from '~/components/PageHeader';
import { getUser } from '~/utils/session.server';
import type { User } from '@prisma/client';

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const user = await getUser(request);
    const post = await db.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return { user, post };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    try {
      const post = await db.post.findUnique({
        where: {
          id: params.id,
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (user && user.id === post.id) {
        await db.post.delete({
          where: {
            id: params.id,
          },
        });
      }
      return redirect('/posts');
    } catch (error: any) {
      throw new Error(error);
    }
  }
};

const Post = () => {
  const { user, post } = useLoaderData<{ user: User; post: any }>();

  return (
    <div className='container mx-auto'>
      <div className='max-w-5xl mx-auto'>
        <PageHeader title={post.title}>
          {user.id === post.userId && (
            <form action='POST'>
              <input type='hidden' name='_method' value='delete' />
              <button className='btn btn--danger'>Delete</button>
            </form>
          )}
        </PageHeader>
        <div className='pt-4 text-gray-600'>
          <p>{post.body}</p>
          <small className='text-gray-500'>
            {new Date(post.createdAt).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Post;
