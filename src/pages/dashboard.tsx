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

import HidePdfs from '@/components/HidePdfs';
import { usePdfs } from '@/components/PdfsContext';

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

function dashboard() {
  // const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;
  const userName = session?.user?.name as string;
  const { showPdfs, toggleShowPdfs } = usePdfs();

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
        <div className=''>
          <StudySessionMap
            StudySessions={dataStudySessions}
            showPdfs={showPdfs}
            id={userId}
          />
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
          <PDFS pdfList={dataPDFs} />
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className='flex'>
      <div
        className={`bg-lightBlue overflow-hidden  py-[10px] transition-transform duration-300  ${
          showPdfs
            ? 'w-1/4 min-w-[200px] max-w-[220px] translate-x-0 px-[20px]'
            : '-translate-x-full'
        }`}
      >
        {showPdfs ? <div>{renderResultsPDFS()}</div> : <div className=''></div>}
      </div>
      <div className='bg-blueToTest flex-grow overflow-auto'>
        <div className='flex justify-between bg-white px-[30px] py-[30px]'>
          <div className='flex items-center p-[10px]'>Logo</div>
          <div className='mx-auto flex items-center p-[10px] text-[24px] font-bold leading-normal'>
            Welcome {userName}
          </div>
          <div>
            <SignOut />
          </div>
        </div>
        <div className='relative top-[10px]'>
          <HidePdfs showPdfs={showPdfs} toggleShowPdfs={toggleShowPdfs} />
        </div>
        <div className='bg-blueToTest mx-auto flex min-h-screen flex-wrap justify-center  transition-transform duration-300'>
          <div className='flex flex-wrap px-[50px] py-[20px]'>
            <div>{renderResultsStudySessions()}</div>
          </div>
        </div>
        <div className='bg-white px-[30px] py-[40px]'>Footer</div>
      </div>
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
