import * as React from 'react';

import CallToAction from '@/components/CallToAction';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import Link from 'next/link';

/*  
In header make Login in button that will send user to auth/signin page
When they complete the auth sign in page reroute to dashboard
Uses data from Google Sign in to create user account
Have reroute from sign in page do API call to create user

Have a get started button in the middle of the CallToAction where user
doesnt need to login in to start using the service
Tell user that they need to log in to have history saved

*/

export default function LandingPage() {
  return (
    <Layout>
      <Seo />

      <main>
        <Header />
        <div className='min-h-screen'>
          <CallToAction />
          <div className='p-[20px]'>Example of a study page</div>
          <Link href='/dashboard' className='bg-blue-100 p-[20px]'>
            Click Here for Dashboard
          </Link>
        </div>
        <Footer />
      </main>
    </Layout>
  );
}
