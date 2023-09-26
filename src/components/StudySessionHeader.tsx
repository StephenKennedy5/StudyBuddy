import { useRouter } from 'next/router';

import SignOut from '@/components/buttons/signOutButton';

export default function StudySessionHeader({ studySessionName }) {
  const router = useRouter();
  return (
    <div className='flex justify-between px-[30px] py-[25px]'>
      <div
        onClick={() => router.push('/dashboard')}
        className=' bg-mainBlue hover:bg-lightBlue flex cursor-pointer items-center rounded-[10px] px-[10px] py-[15px] text-center text-white'
      >
        Dashboard
      </div>

      <div className='flex items-center justify-center p-[10px] text-center text-[24px] font-bold leading-normal'>
        {studySessionName}
      </div>

      <div className='flex items-center justify-center'>
        <SignOut />
      </div>
    </div>
  );
}
