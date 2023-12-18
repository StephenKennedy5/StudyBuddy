import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <div
      onClick={() => signOut({ callbackUrl: '/' })}
      className='bg-mainBlue  cursor-pointer rounded-[10px] px-[20px] py-[15px] text-center  text-white hover:bg-opacity-75'
    >
      Log Out
    </div>
  );
}
