import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import SignOut from 'src/components/buttons/signOutButton';
import NewPdf from 'src/components/newPdf';
import PDFS from 'src/components/Pdfs';
import StudySessionMap from 'src/components/StudySessionDashboard';

import { fetchCreds, routes } from '@/lib/routes';

import { authOptionsCb } from './api/auth/[...nextauth]';

/* Hide and show user PDF tab with button click */

type StudySessionProps = {
  session_name: string;
  subject: string;
  chat_log_id: string;
  id: string;
};

interface UserPdfsProps {
  id: string;
  pdf_info: string;
  title: string;
  upload_date: string;
  user_id: string;
}

interface StudySessionArray {
  studySessions: StudySessionProps[];
  userPdfs: UserPdfsProps[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FETCH_CREDENTIALS = process.env.NEXT_PUBLIC_FETCH_CREDENTIALS;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

// if (!FETCH_CREDENTIALS) {
//   throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
// }

// const fetchCreds = FETCH_CREDENTIALS || 'same-origin';

function dashboard() {
  const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;
  const userName = session?.user?.name as string;

  const {
    isLoading: isLoadingStudySessions,
    isError: isErrorStudySessions,
    isSuccess: isSuccessStudySessions,
    data: dataStudySessions,
  } = useQuery(
    ['DashboardStudySessions', userId],
    async () => {
      const res = await fetch(routes.getStudySession(userId), {
        method: 'GET',
        credentials: fetchCreds as RequestCredentials,
      });
      if (!res.ok) throw new Error('Failed to fetch study Session');
      const body = await res.json();
      return body;
    },
    { enabled: !!userId }
  );

  const {
    isLoading: isLoadingPDFs,
    isError: isErrorPDFs,
    isSuccess: isSuccessPDFs,
    data: dataPDFs,
  } = useQuery(
    ['DashboardPDFS', userId],
    async () => {
      const res = await fetch(routes.getPdfs(userId), {
        method: 'GET',
        credentials: fetchCreds as RequestCredentials,
      });
      if (!res.ok) throw new Error('Failed to fetch PDFs');
      const body = await res.json();
      return body;
    },
    { enabled: !!userId }
  );

  const renderResultsStudySessions = () => {
    if (isLoadingStudySessions) {
      // Fix loading... animation
      return <div className='loading text-center text-[24px]'>Loading</div>;
    }
    if (isErrorStudySessions) {
      return (
        <div className='text-center text-[24px]'>
          Something went wrong. Please refresh page.
        </div>
      );
    }
    // session.user needs to exists for isSuccess to be true
    if (isSuccessStudySessions && session?.user) {
      return (
        <div>
          <div>
            <StudySessionMap
              StudySessions={dataStudySessions}
              showPdfs={showPdfs}
              id={userId}
            />
          </div>
        </div>
      );
    }
    return <></>;
  };

  const renderResultsPDFS = () => {
    if (isLoadingPDFs) {
      // Fix loading... animation
      return <div className='loading text-center text-[24px]'>Loading</div>;
    }
    if (isErrorPDFs) {
      return (
        <div className='text-center text-[24px]'>
          Something went wrong. Please refresh page.
        </div>
      );
    }
    // session.user needs to exists for isSuccess to be true
    if (isSuccessPDFs && session?.user) {
      return (
        <div>
          <div>
            <PDFS pdfList={dataPDFs} />
          </div>
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className=''>
      <div className='flex justify-between px-[30px] py-[30px]'>
        <div className='flex items-center p-[10px]'>Logo</div>
        <div className='flex items-center p-[10px]'>Welcome {userName}</div>
        <div>
          <SignOut />
        </div>
      </div>
      <div className='bg-grey mx-auto flex min-h-screen'>
        <div
          className={`bg-lightBlue max-w-[40%] px-[20px] py-[10px] transition-transform duration-300  ${
            showPdfs ? 'translate-x-0 ' : '-translate-x-full'
          }`}
        >
          {showPdfs ? <div>{renderResultsPDFS()}</div> : <div></div>}
        </div>

        <div className='px-[30px] py-[20px]'>
          <div
            className={`absolute z-10 cursor-pointer bg-green-100 p-[20px] transition-transform duration-300 ease-in-out ${
              !showPdfs ? 'translate-x-[-30px]' : 'translate-x-[-20px]'
            }`}
            onClick={() => setShowPdfs(!showPdfs)}
          >
            {showPdfs ? 'Hide Pdfs' : 'Show Pdfs'}
          </div>

          <div>{renderResultsStudySessions()}</div>
        </div>
      </div>
      <div className='px-[30px] py-[40px]'>Footer</div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptionsCb(context.req, context.res)
  );

  return { props: {} };
}

export default dashboard;
