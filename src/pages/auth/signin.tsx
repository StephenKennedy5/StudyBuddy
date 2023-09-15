import { getServerSession } from 'next-auth';
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';

import { authOptionsCb } from '../api/auth/[...nextauth]';

export default function SignIn() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='rounded-lg bg-white px-[40px] py-[50px] shadow-lg'>
        <div
          onClick={(e) => {
            e.preventDefault();
            signIn('google', { callbackUrl: `/auth/signin` });
          }}
          className='cursor-pointer  rounded-[10px]  bg-blue-200 px-[24px] py-[16px] text-center hover:bg-blue-100'
        >
          <div className='text-lg font-semibold '>Sign In with Google</div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptionsCb(context.req, context.res)
  );
  const csrfToken = await getCsrfToken(context);
  const error = context?.query?.error ?? null;

  if (session) {
    console.log({ session });
    console.log('HELLO SERVER');
    return { redirect: { destination: '/dashboard' } };
  }

  const providers = await getProviders();
  console.log({ providers });
  return { props: { providers: providers ?? [] } };
}
