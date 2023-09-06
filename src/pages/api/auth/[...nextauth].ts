import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptionsCb = () => {
  return {
    providers: [
      GoogleProvider({
        clientId,
        clientSecret,
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error', // Error code passed in query string as ?error=
      verifyRequest: '/auth/verify-request', // (used for check email message)
      newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log('SIGN IN DEBUG');
        console.log('user');
        console.log(user);
        console.log('account');
        console.log(account);
        console.log('profile');
        console.log(profile);
        return true;
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
      async session({ session, user, token }) {
        return session;
      },
    },
  };
};

/*

  profile(profile) {
    return {
      id: this.id,
      name: this.name,
      // Return all the profile information you need.
      // The only truly required field is `id`
      // to be able identify the account when added to a database
    };
  },
});
*/
