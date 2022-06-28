import type { Post } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import db from '~/utils/db.server';
import PageHeader from '~/components/PageHeader';

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    take: 20,
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts;
};

const Posts = () => {
  const posts = useLoaderData<Post[]>();

  return (
    <div className='container mx-auto'>
      <div className='max-w-5xl mx-auto'>
        <PageHeader title='Posts'>
          <Link to='/posts/new' className='btn btn--success'>
            Create New Post
          </Link>
        </PageHeader>

        {posts.map((post) => (
          <div key={post.id} className='mt-4'>
            <Link to={`/posts/${post.id}`}>
              <h1 className='text--gradient font-bold text-lg'>{post.title}</h1>
              <p className='text-gray-700'>
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
