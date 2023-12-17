import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import * as React from 'react';
import { RefObject, useEffect, useRef, useState } from 'react';
import SignOut from 'src/components/buttons/SignOutButton';
import NewPdf from 'src/components/newPdf';
import PDFS from 'src/components/Pdfs';
import StudySessionMap from 'src/components/StudySessionDashboard';

import { fetchCreds, routes } from '@/lib/routes';

import HidePdfs from '@/components/HidePdfs';
import { usePdfs } from '@/components/PdfsContext';
import useOnScreen from '@/components/useOnScreen';

import { authOptionsCb } from './../api/auth/[...nextauth]';

/* Hide and show user PDF tab with button click */

interface PdfInfo {
  id: string;
  title: string;
  user_id: string;
  upload_date: string;
  updated_date: string;
  AWS_Key: string;
  AWS_Bucket: string;
}
interface ChatLogsProps {
  id: string;
  chat_message: string;
  creation_date: string;
  user_id: string;
  chat_bot: boolean;
  pdf_id: string;
}

interface ChatSessionProps {
  chatLogs: ChatLogsProps[];
  pdfId: string;
  pdfInfo: PdfInfo;
}

interface User {
  sub: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

// Adjust the session object type to include the User type
interface Session {
  user?: User | null | undefined;
  expires?: string;
}

const PdfViewer = dynamic(() => import('src/components/PdfViewer'), {
  ssr: false,
});

function ChatSession({ chatLogs, pdfId, pdfInfo }: ChatSessionProps) {
  // const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub || '';
  // const userName = session?.user?.name as string;
  const { showPdfs, toggleShowPdfs } = usePdfs();
  const router = useRouter();
  const chatContainerRef: RefObject<HTMLDivElement> = useRef(null);
  const [askingQuestion, setAskingQuestion] = useState(false);
  const isOnScreen = useOnScreen(chatContainerRef);
  const [displayError, setDisplayError] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [newQuestion, setNewQuestion] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [chatMessagesState, setChatMessages] = useState(chatLogs);

  const lastSixMessages = chatMessagesState.slice(-6);

  const baseTextStyle = 'text-[16px] leading-normal py-[20px]';
  const pdfsShownStyle = 'px-[30px]';
  const pdfsHiddenStyle = 'px-[150px]';

  useEffect(() => {
    setChatMessages(chatLogs);
  }, [chatLogs]);

  const textCls = classNames({
    [baseTextStyle]: true,
    [pdfsShownStyle]: showPdfs,
    [pdfsHiddenStyle]: !showPdfs,
  });

  const {
    isLoading: isLoadingPDFs,
    isError: isErrorPDFs,
    isSuccess: isSuccessPDFs,
    data: dataPDFs,
  } = useQuery(
    ['ChatSessionPDFS', userId],
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
          <PDFS pdfList={dataPDFs} pdfFile={pdfFile} setPdfFile={setPdfFile} />
        </div>
      );
    }
    return <></>;
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessagesState]);

  const submitNewChatMessage = async () => {
    if (newQuestion.trim() === '') return;
    if (askingQuestion) {
      console.log('Tried asking another question');
      return;
    }
    setAskingQuestion(true);

    // Optimistic update adds the new question to the chat logs
    const newQuestionMessage = {
      id: 'temp-id',
      pdf_id: pdfId,
      chat_message: newQuestion,
      creation_date: new Date().toISOString(),
      user_id: userId,
      chat_bot: false,
    };
    console.log({ Message: newQuestionMessage.chat_message });
    setChatMessages((prevMessages) => [...prevMessages, newQuestionMessage]);

    const requestBody = {
      chat_message: newQuestion,
      lastSixMessages: lastSixMessages,
    };

    try {
      const response = await fetch(routes.newChatMessage(userId, pdfId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Chat message sent successfully');
        const newMessage = await response.json();

        // Replace the temporary message with the actual response from the server
        setChatMessages(() => [...newMessage]);

        setNewQuestion('');
        setAskingQuestion(false);
      } else {
        console.error('Chat message failed to upload');

        // Revert the optimistic update on error
        setChatMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== 'temp-id')
        );
      }
    } catch (error) {
      console.error('Error uploading chat message: ', error);
      setAskingQuestion(false);
      setDisplayError(true);
      // Revert the optimistic update on error
      setChatMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== 'temp-id')
      );
      setNewQuestion('');
      setTimeout(() => {
        setDisplayError(false);
      }, 5000);
    }
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
          <div
            onClick={() => router.push('/dashboard')}
            className='flex items-center justify-center'
          >
            <div className=' bg-mainBlue hover:bg-lightBlue flex cursor-pointer items-center rounded-[10px] px-[10px] py-[15px] text-center text-white'>
              Dashboard
            </div>
          </div>
          <div className='mx-auto flex items-center p-[10px] text-[24px] font-bold leading-normal'>
            Chatting with {pdfInfo.title}
          </div>
          <div>
            <SignOut />
          </div>
        </div>
      </div>

      <div
        className={`grid h-[calc(100vh-116px)]  ${
          showPdfs ? 'grid-cols-7' : 'grid-cols-6'
        }`}
      >
        {showPdfs && (
          <div className={` col-span-1 overflow-auto`}>
            <div
              className={`h-full w-full border-r-[2px] border-gray-100 bg-white  transition-transform duration-300 `}
            >
              {showPdfs ? <div>{renderResultsPDFS()}</div> : <div></div>}
            </div>
          </div>
        )}
        <div className=' col-span-3 overflow-x-auto overflow-y-auto border-x-[2px] border-gray-100 bg-white px-[10px] py-[10px]'>
          <div className='relative top-[10px]'>
            <HidePdfs showPdfs={showPdfs} toggleShowPdfs={toggleShowPdfs} />
          </div>
          <div>
            <PdfViewer pdfFile={pdfInfo.AWS_Key} />
          </div>
        </div>

        <div className='col-span-3 flex flex-col overflow-auto  border-x-[2px] border-gray-100'>
          <div className='flex-grow'>
            {chatMessagesState.map(({ chat_message, id, chat_bot }) => {
              // UserId !=
              const chatBotFalse =
                'bg-mainBlue text-white rounded-[20px] mx-[20px] my-[20px]';
              // UserId ==
              const chatBotTrue =
                'bg-gray-100 rounded-[20px] mx-[20px] my-[20px]';
              // Base Styling
              const chatMessageBase = 'text-black';

              const chatMessageCls = classNames({
                [chatMessageBase]: true,
                [chatBotTrue]: chat_bot,
                [chatBotFalse]: !chat_bot,
                [textCls]: true,
              });
              return (
                <div key={id} className={chatMessageCls}>
                  <div className='mx-auto max-w-[600px] whitespace-pre-line'>
                    {chat_message}
                  </div>
                </div>
              );
            })}
            {askingQuestion ? (
              <div className='mx-[20px] my-[20px]  rounded-[20px] bg-gray-100 px-[30px] py-[20px] text-[16px] leading-normal'>
                <div className=''>
                  Processing Question{' '}
                  <span className='animate-pulse text-[18px]'>. . .</span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {displayError ? (
              <div className='mx-[20px] my-[20px] rounded-[20px] bg-red-300 px-[30px] py-[20px] text-[16px] leading-normal'>
                <div className=''>Error Asking Question. Please Try Again </div>
              </div>
            ) : (
              <div></div>
            )}
            <div ref={chatContainerRef} />
          </div>

          <div className='   bg-white px-[20px] pb-[20px] pt-[20px]'>
            <div className='mx-auto max-w-[650px] items-center'>
              <div className='relative flex-1'>
                <div className='flex w-full flex-row'>
                  <TextareaAutosize
                    minRows={1}
                    maxRows={4}
                    placeholder='Ask Question Here'
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
                      strokeLinejoin='round'
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
      <div className='relative z-30'>
        {!isOnScreen ? (
          <div
            onClick={() => scrollToBottom()}
            className='bg-mainBlue absolute bottom-[3vh] left-1/2 -translate-x-1/2 transform cursor-pointer rounded-[50px]  px-[10px] py-[10px] text-white opacity-25 hover:opacity-75'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              fill='none'
              stroke='white'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M5 8l7 7 7-7' />
            </svg>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptionsCb(context.req, context.res)
  )) as Session;

  console.log({ session });

  const userId = session?.user?.sub || '';
  const { pdfId } = context.params as ParsedUrlQuery;

  try {
    const resChat = await fetch(routes.getChatLogs(userId, pdfId as string));
    if (!resChat.ok) {
      throw new Error(`API request failed with status: ${resChat.status}`);
    }
    const chatLogs = await resChat.json();
    const pdfTitle = await fetch(routes.getPdfName(userId, pdfId as string));
    if (!pdfTitle.ok) {
      throw new Error(`API request failed with status: ${pdfTitle.status}`);
    }
    const pdfInfo: PdfInfo = await pdfTitle.json();

    // Fetch all Pdfs

    return { props: { chatLogs, pdfId, pdfInfo } };
  } catch (error) {
    console.error('API request error:', error);
    return { props: { chatLogs: [] } };
  }
}

export default ChatSession;
