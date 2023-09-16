import type { IncomingMessage, ServerResponse } from 'http';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { AuthOptions, SessionStrategy } from 'next-auth';
import NextAuth from 'next-auth';
import { getToken } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

import { MyAdapter } from './adapter';

const clientId = process.env.GOOGLE_ID;
const clientSecret = process.env.GOOGLE_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Do basic sign in that doesnt store in adapter

if (!clientId) {
  throw new Error('GOOGLE_ID environment variable is not defined');
}

if (!clientSecret) {
  throw new Error('GOOGLE_SECRET environment variable is not defined');
}

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

export const authOptionsCb = (
  req: IncomingMessage | NextApiRequest | GetServerSidePropsContext['req'],
  res: ServerResponse | NextApiResponse
): AuthOptions => {
  return {
    providers: [
      GoogleProvider({
        clientId: clientId,
        clientSecret: clientSecret,
      }),
    ],
    adapter: MyAdapter(req, res),
    callbacks: {
      async signIn({ user, account, profile }) {
        return true;
      },
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
      async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token from a provider.
        return {
          user: token,
          expires: session.expires,
        };
      },
    },
    pages: {
      signIn: 'auth/signin',
      verifyRequest: '/auth/verify-request',
      error: 'auth/signin',
    },
    session: {
      // Choose how you want to save the user session.
      // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
      // If you use an `adapter` however, we default it to `"database"` instead.
      // You can still force a JWT session by explicitly defining `"jwt"`.
      // When using `"database"`, the session cookie will only contain a `sessionToken` value,
      // which is used to look up the session in the database.
      strategy: 'jwt' as SessionStrategy,

      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
    },
  };
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  return await NextAuth(req, res, authOptionsCb(req, res));
}
