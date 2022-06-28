import { createCookieSessionStorage, redirect } from '@remix-run/node';
import bcrypt from 'bcrypt';
import db from './db.server';

export async function signin({ username, password }: TSigninPayload) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;
  return user;
}

export async function signup({ username, password }: TSignupPayload) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { username, passwordHash } });
  return user;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('Session Secret not found');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'remix_blog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return await storage.getSession(request.headers.get('Cookie'));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    return null;
  }
}

export async function signOut(request: Request) {
  const session = await getUserSession(request);

  return redirect('/auth/sign-out', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
