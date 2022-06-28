import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  useLoaderData,
} from '@remix-run/react';
import type { PropsWithChildren } from 'react';
import type {
  LinksFunction,
  MetaFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from '@remix-run/node';
import Navbar from './components/Navbar';
import { getUser } from './utils/session.server';
import type { User } from '@prisma/client';

import styles from './styles/app.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Blog',
  viewport: 'width=device-width,initial-scale=1',
});

const Document = ({ children }: PropsWithChildren<{}>) => (
  <html lang='en'>
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      {process.env.NODE_ENV === 'development' && <LiveReload />}
    </body>
  </html>
);

export const loader: LoaderFunction = async ({ request }) => {
  return await getUser(request);
};

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const user = useLoaderData<User>();
  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
    </>
  );
};

const App = () => (
  <Document>
    <Layout>
      <Outlet />
    </Layout>
  </Document>
);

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <Document>
    <Layout>
      <section className='min-h-content items-center flex'>
        <div className='container mx-auto text-center space-y-4'>
          <h1 className='text--heading-1'>Error</h1>
          <pre className='text-gray-500'>{error.message}</pre>
          <Link to='/' className='btn btn--success'>
            Go Home
          </Link>
        </div>
      </section>
    </Layout>
  </Document>
);

export default App;
