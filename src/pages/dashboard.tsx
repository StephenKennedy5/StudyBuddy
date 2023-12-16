import { TextareaAutosize } from '@mui/base/TextareaAutosize';
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

function Dashboard() {
  // const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;
  const userName = session?.user?.name as string;
  const { showPdfs, toggleShowPdfs } = usePdfs();

  const [newQuestion, setNewQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [chatMessagesState, setChatMessages] = useState([]);
  const lastSixMessages = chatMessagesState.slice(-6);

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
      return (
        <div className='loading text-center text-[24px]'>
          Loading <span className='animate-pulse'>...</span>
        </div>
      );
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

  const submitNewChatMessage = async () => {
    if (newQuestion.trim() === '') return;
    if (askingQuestion) {
      console.log('Tried asking another question');
      return;
    }
    setAskingQuestion(true);

    setNewQuestion('');
    setTimeout(() => {
      setAskingQuestion(false);
    }, 5000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitNewChatMessage();
    }
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
        <div className='col-span-1 overflow-auto'>
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

        <div className='col-span-3 flex flex-col overflow-auto border-x-[2px] border-gray-100'>
          <div className='flex-grow'>
            {askingQuestion ? (
              <div className='mx-[20px] my-[20px] animate-pulse  rounded-[20px] bg-red-300 px-[30px] py-[20px] text-[16px] leading-normal'>
                Please Upload a PDF to Begin Chatting
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className='bg-white px-[20px] pb-[20px] pt-[20px]'>
            <div className='mx-auto max-w-[650px] items-center'>
              {/* Use a container div to create the input box */}
              <div className='relative flex-1'>
                <div className='flex w-full flex-row'>
                  <TextareaAutosize
                    minRows={1}
                    maxRows={4}
                    placeholder='Upload a PDF To being Chatting'
                    onKeyDown={handleKeyDown}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className='border-mainBlue flex max-h-[300px] w-full resize-none items-center rounded-l-[10px] border bg-white px-[20px] py-[15px] focus:border-opacity-75'
                  />

                  <div
                    className='bg-mainBlue flex  cursor-pointer items-center rounded-r-[10px] px-[10px] py-[10px] text-center text-white hover:opacity-75'
                    onClick={() => {
                      submitNewChatMessage();
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      fill='none'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      stroke-linejoin='round'
                    >
                      <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
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

export default Dashboard;
