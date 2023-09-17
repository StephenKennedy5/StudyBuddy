import type { IncomingMessage, ServerResponse } from 'http';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';

import { fetchCreds, routes } from '@/lib/routes';

import Login from '@/pages/api/login';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

/** @return { import("next-auth/adapters").Adapter } */
export function MyAdapter(
  req: IncomingMessage | NextApiRequest | GetServerSidePropsContext['req'],
  res: ServerResponse | NextApiResponse
): Adapter {
  return {
    async createUser(user) {
      try {
        const loginUser = await fetch(routes.login(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: user.name, email: user.email }),
        });
        if (!loginUser.ok) {
          throw new Error('API login endpoint down');
        }
        const loginResponseData = await loginUser.json();

        return {
          id: loginResponseData[0].id,
          ...user,
        };
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async getUser(id) {
      return null;
    },
    async getUserByEmail(email) {
      return null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log('getUserByAccount');
      return null;
    },
    async updateUser(user) {
      return null;
    },
    async deleteUser(userId) {
      return null;
    },
    async linkAccount(account) {
      return null;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return null;
    },
    async createSession(session) {
      console.log('createSession');
      console.log({ session });
      return session;
    },
    async getSessionAndUser(sessionToken) {
      console.log('getSessionAndUser');
      console.log({ sessionToken });
      return null;
    },
    async updateSession({ sessionToken }) {
      return null;
    },
    async deleteSession(sessionToken) {
      return null;
    },
    async createVerificationToken({ identifier, expires, token }) {
      // Dont need as not doing email verfication
      console.log('createVerificationToken');
      console.log({ token });
      return null;
    },
    async useVerificationToken({ identifier, token }) {
      // Dont need as not doing email verficiation
      console.log('useVerificationToken');
      console.log({ token });
      return null;
    },
  };
}
