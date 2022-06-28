import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';

interface TNavbar {
  user?: User;
}

const Navbar = ({ user }: TNavbar) => (
  <header className='shadow-md mb-6'>
    <div className='container  mx-auto'>
      <div className='-mx-4 flex justify-between'>
        <Link to='/' className='p-4 text--heading-1'>
          Remix Blog
        </Link>
        <nav className='flex items-center'>
          <Link to='/posts' className='btn'>
            Posts
          </Link>
          {user ? (
            <form action='/auth/sign-out' method='POST'>
              <button className='btn btn--danger' type='submit'>
                Sign out {user.username}
              </button>
            </form>
          ) : (
            <Link to='/auth/signin' className='btn btn--success'>
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </div>
  </header>
);

export default Navbar;
