import { useRouter } from 'next/router';
import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

// const links = [
//   { href: '/', label: 'Route 1' },
//   { href: '/', label: 'Route 2' },
// ];

export default function Header() {
  const router = useRouter();
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-[56px] items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Home
        </UnstyledLink>
        <div
          onClick={() => router.push('/auth/signin')}
          className='cursor-pointer rounded-[10px] bg-blue-200 px-[20px] py-[10px] hover:bg-blue-100'
        >
          Sign In
        </div>
      </div>
    </header>
  );
}
