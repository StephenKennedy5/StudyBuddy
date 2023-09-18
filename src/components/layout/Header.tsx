import { useRouter } from 'next/router';
import * as React from 'react';
import SignIn from 'src/components/buttons/SignInButton';

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
          LOGO
        </UnstyledLink>
        <div>
          <SignIn />
        </div>
      </div>
    </header>
  );
}
