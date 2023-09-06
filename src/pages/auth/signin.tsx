import { getProviders, signIn } from 'next-auth/react';

function SignIn({ providers }) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='rounded-lg bg-white px-[40px] py-[50px] shadow-lg'>
        <div
          onClick={() => console.log('Sign in with Google')}
          className='cursor-pointer  rounded-[10px]  bg-blue-200 px-[24px] py-[16px] text-center hover:bg-blue-100'
        >
          <div className='text-lg font-semibold '>Sign In with Google</div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
