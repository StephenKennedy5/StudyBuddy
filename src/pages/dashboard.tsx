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
    <div className='flex flex-col'>
      <div>
        <div className='flex justify-between border-b-[4px] border-gray-100 bg-white px-[30px] py-[30px]'>
          <div className='flex items-center p-[10px]'>Logo</div>
          <div className='mx-auto flex items-center p-[10px] text-[24px] font-bold leading-normal'>
            Welcome {userName}
          </div>
          <div>
            <SignOut />
          </div>
        </div>
      </div>

      <div className='grid h-[calc(100vh-116px)] grid-cols-7'>
        <div>
          <div
            className={`h-full w-full border-r-[2px] border-gray-100 bg-white  transition-transform duration-300 `}
          >
            {showPdfs ? <div>{renderResultsPDFS()}</div> : <div></div>}
          </div>
        </div>
        <div className=' col-span-3 flex justify-center overflow-x-auto overflow-y-auto border-x-[2px] border-gray-100 bg-white px-[10px] py-[10px]'>
          {/* <div className='relative top-[10px]'>
            <HidePdfs showPdfs={showPdfs} toggleShowPdfs={toggleShowPdfs} />
          </div> */}
          <div className='mt-[100px] px-[30px] text-center text-[32px] leading-loose'>
            Upload a PDF to start chatting with it
          </div>
        </div>

        <div className='col-span-3 flex flex-col  border-x-[2px] border-gray-100'>
          <div className='flex-grow'></div>

          <div className=' bg-green-50 px-[40px] pb-[20px] pt-[40px]'>
            <div className='mx-auto flex max-w-[650px] items-center'>
              {/* Use a container div to create the input box */}
              <div className='relative flex-1'>
                <textarea
                  value=''
                  placeholder='Asks Questions here about PDF'
                  rows={2} // Set the number of rows dynamically
                  className={`focus:ring-mainBlue border-lightBlue flex w-full resize-none items-center rounded-lg border bg-white px-[40px] py-[10px] focus:outline-none focus:ring-2 `} // Apply dynamic styles for overflow and height
                />
              </div>
              {/* Set onClick to call the API endpoint of a new chat message */}
              {/* Make a mock response message to act like a real conversation in which messages arrive 5 seconds later */}
              <div
                className='bg-mainBlue hover:bg-lightBlue ml-2 cursor-pointer rounded-full px-[20px] py-[10px] text-center text-white'
                onClick={() => {
                  sumbitNewChatMessage();
                }}
              >
                Submit
              </div>
            </div>
          </div>
        </div>
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
