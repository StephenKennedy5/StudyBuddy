import type { IncomingMessage, ServerResponse } from 'http';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { AuthOptions, SessionStrategy } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
  console.log(clientId);
  console.log(clientSecret);
  return {
    providers: [
      GoogleProvider({
        clientId: clientId,
        clientSecret: clientSecret,
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log('user');
        console.log(user);
        console.log('account');
        console.log(account);
        console.log('profile');
        console.log(profile);
        return true;
      },
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
    pages: {
      signIn: 'auth/signin',
    },
  };
};

// export default (req, res) => NextAuth(req, res, options);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptionsCb(req, res));
}
