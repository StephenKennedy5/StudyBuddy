import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import NewPdf from 'src/components/newPdf';
import PDFS from 'src/components/Pdfs';
import StudySessionMap from 'src/components/StudySessionDashboard';

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

if (!FETCH_CREDENTIALS) {
  throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
}

const fetchCreds = FETCH_CREDENTIALS || 'same-origin';

function dashboard() {
  const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;
  const userName = session?.user?.name as string;
  // const userId = user.id;
  console.log({ userId });
  // console.log({ userId: user.sub });

  const {
    isLoading: isLoadingStudySessions,
    isError: isErrorStudySessions,
    isSuccess: isSuccessStudySessions,
    data: dataStudySessions,
  } = useQuery(
    ['DashboardStudySessions', userId],
    async () => {
      const res = await fetch(`${baseUrl}/api/${userId}/study-sessions`, {
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
      const res = await fetch(`${baseUrl}/api/${userId}/getPdfs`, {
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
      console.log(dataStudySessions);
      return (
        <div>
          <div>
            <StudySessionMap
              StudySessions={dataStudySessions}
              showPdfs={showPdfs}
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
      console.log(dataPDFs);
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
    <div>
      <div className='flex justify-between px-[30px] py-[30px]'>
        <div className='flex items-center p-[10px]'>Logo</div>
        <div className='flex items-center p-[10px]'>Welcome {userName}</div>
        <div
          onClick={() => signOut({ callbackUrl: '/' })}
          className='cursor-pointer rounded-[10px] bg-blue-50 px-[20px] py-[10px]'
        >
          LogOut
        </div>
      </div>
      <div className='mx-auto flex bg-slate-100'>
        <div
          className={`max-w-[40%] bg-blue-300 px-[20px] py-[10px] transition-transform duration-300  ${
            showPdfs ? 'translate-x-0 ' : '-translate-x-full'
          }`}
        >
          <div>{renderResultsPDFS()}</div>
        </div>

        <div className='px-[30px] py-[20px]'>
          <div
            className={`absolute z-10 cursor-pointer bg-green-100 p-[20px] transition-transform duration-300 ${
              !showPdfs ? '-translate-x-full' : 'translate-x-[-20px]'
            }`}
            onClick={() => setShowPdfs(!showPdfs)}
          >
            {showPdfs ? 'Hide Pdfs' : 'Show Pdfs'}
          </div>

          <div></div>
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
  console.log({ session });
  // Get user id
  // use user ID to call other API endpoints
  // Connect through API?

  // const userId = '1972c0eb-a3ed-4377-b09f-79684995899f';
  // const host = 'http://localhost:3000';
  // const apiEndpoint = `${host}/api/${userId}/study-sessions`;
  // const apiEndPointPdfs = `${host}/api/${userId}/getPdfs`;

  // const res = await fetch(apiEndpoint);
  // const studySessions = await res.json();

  // const resPdfs = await fetch(apiEndPointPdfs);
  // if (!resPdfs.ok) {
  //   throw new Error(`API request failed with status: ${resPdfs.status}`);
  // }
  // const userPdfs = await resPdfs.json();

  return { props: {} };
}

export default dashboard;
