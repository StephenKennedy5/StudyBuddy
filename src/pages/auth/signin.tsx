import { getServerSession } from 'next-auth';
import { getProviders, signIn } from 'next-auth/react';

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
  const session = await getServerSession(context.req, context.res);

  if (session) {
    console.log({ session });
  }

  const providers = await getProviders();
  return { props: { providers: providers ? Object.values(providers) : [] } };
}
