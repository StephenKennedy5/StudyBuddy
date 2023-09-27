import Router, { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function SignIn() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/auth/signin')}
      className='bg-mainBlue hover:bg-lightBlue cursor-pointer rounded-[10px] px-[20px] py-[10px] text-white'
    >
      Sign In
    </div>
  );
}
