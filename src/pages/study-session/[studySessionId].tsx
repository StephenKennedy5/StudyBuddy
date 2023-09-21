import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { signOut, useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import SignOut from 'src/components/buttons/signOutButton';
import Chat from 'src/components/Chat';
// import NewPdf from 'src/components/newPdf';
import PDFS from 'src/components/Pdfs';

import { fetchCreds, routes } from '@/lib/routes';

import HidePdfs from '@/components/HidePdfs';
import { usePdfs } from '@/components/PdfsContext';

import { authOptionsCb } from './../api/auth/[...nextauth]';

/*

    "id": "9f10300c-2d4a-4e52-b67a-4b1910492545",
    "chat_id": "80d2fb15-0df8-44b6-b389-2e817f7b82b5",
    "chat_message": "I need help with understanding the following concept",
    "creation_date": "2023-08-18T12:00:00.000Z",
    "user_id": "1972c0eb-a3ed-4377-b09f-79684995899f"

*/

/* 
    Create Component for chat messages between User and Bot
    Make API call to Get name of current Session
*/

interface ChatLogsArray {
  chatLogs: ChatLogsProps[];
}

interface ChatLogsProps {
  id: string;
  chat_id: string;
  chat_message: string;
  creation_date: string;
  user_id: string;
}

interface PDFProps {
  id: string;
  pdf_info: string;
  title: string;
  upload_date: string;
  user_id: string;
}

interface StudySessionProp {
  studySessions: StudySessionProps;
}

interface StudySessionProps {
  session_name: string;
  subject: string;
  chat_log_id: string;
  id: string;
}

interface StudySessionTypes {
  chatLogs: ChatLogsProps[];
  studySession: StudySessionProps;
  userPdfs: PDFProps;
}

function StudySession({ chatLogs, studySession, userPdfs }: StudySessionTypes) {
  const studySessionName = studySession.session_name;
  const router = useRouter();
  // const [showPdfs, setShowPdfs] = useState(true);
  const { showPdfs, toggleShowPdfs } = usePdfs();

  const [newQuestion, setNewQuestion] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);
  const [textareaRows, setTextareaRows] = useState(1);

  const maxLines = 3;
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  const [chatMessagesState, setChatMessages] = useState(chatLogs);

  const sumbitNewChatMessage = async () => {
    if (newQuestion.trim() === '') return;

    const requestBody = { chat_message: newQuestion };

    try {
      const response = await fetch(
        routes.newChatMessage(userId, studySession.id),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        console.log('Chat message sent successfully');
        const newMessage = await response.json();
        setChatMessages(() => [...newMessage]);
        setNewQuestion('');
        // Perform any other necessary actions
      } else {
        console.error('Chat message failed to upload');
      }
    } catch (error) {
      console.error('Error uploading chat message: ', error);
    }
  };

  const handleInputChange = (e) => {
    // Update the input value
    setNewQuestion(e.target.value);

    // Check if the input has more lines than maxLines
    const lines = e.target.value.split('\n');
    const newRows = Math.min(maxLines, Math.max(1, lines.length));
    setTextareaRows(newRows);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sumbitNewChatMessage();
    }
  };

  // Create Style Class for PDFS when hidden and shown

  // Create Style class for Chat when pdf hidden and shown

  return (
    <div className='flex min-h-screen'>
      <div
        className={`bg-lightBlue py-[10px] transition-transform duration-300  ${
          showPdfs
            ? 'w-1/4 min-w-[200px] translate-x-0 px-[20px]'
            : '-translate-x-full'
        }`}
      >
        {showPdfs ? <PDFS pdfList={userPdfs} /> : <div></div>}
      </div>

      <div className='flex w-full flex-col'>
        <div className='flex justify-between px-[30px] py-[20px]'>
          <div
            onClick={() => router.push('/dashboard')}
            className=' bg-mainBlue hover:bg-lightBlue cursor-pointer rounded-[10px] px-[10px] py-[15px] text-center text-white'
          >
            Dashboard
          </div>

          <div className='flex items-center justify-center p-[10px] text-center'>
            {studySessionName}
          </div>

          <div className='flex items-center justify-center'>
            <SignOut />
          </div>
        </div>
        <div className='flex flex-grow'>
          <div
            className={
              showPdfs
                ? `flex w-full flex-col justify-between`
                : `flex w-full flex-col justify-between`
            }
          >
            <HidePdfs showPdfs={showPdfs} toggleShowPdfs={toggleShowPdfs} />

            <div className=''>
              {chatMessagesState.map(({ chat_message, id }) => {
                // UserId !=
                const UserIdNotEqual = 'bg-blue-50';
                // UserId ==
                const UserIdEqual = 'bg-green-50';
                // Base Styling
                const chatMessageBase = 'px-[100px] py-[20px] ';

                const chatMessageCls = classNames({
                  [chatMessageBase]: true,
                  [UserIdEqual]: userId == userId,
                  [UserIdNotEqual]: userId != userId,
                });
                return (
                  <div key={id} className={chatMessageCls}>
                    <div>{chat_message}</div>
                  </div>
                );
              })}
            </div>
            <div className='sticky bottom-0 mt-auto bg-green-50 px-[40px] pb-[20px] pt-[40px]'>
              <div className='mx-auto flex max-w-[650px] items-center'>
                {/* Use a container div to create the input box */}
                <div className='relative flex-1'>
                  <textarea
                    value={newQuestion}
                    placeholder='Ask Question Here'
                    onChange={handleInputChange} // Use the updated change handler
                    onKeyDown={handleKeyDown}
                    rows={textareaRows} // Set the number of rows dynamically
                    className={`focus:ring-mainBlue border-lightBlue flex w-full resize-none items-center rounded-lg border bg-white px-[40px] py-[10px] focus:outline-none focus:ring-2 ${
                      textareaRows >= maxLines ? 'overflow-y-auto' : ''
                    }`} // Apply dynamic styles for overflow and height
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
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptionsCb(context.req, context.res)
  );
  const userId = session?.user?.sub;
  const { studySessionId } = context.params as ParsedUrlQuery;

  try {
    const resChat = await fetch(
      routes.getChatLogs(userId, studySessionId as string)
    );
    if (!resChat.ok) {
      throw new Error(`API request failed with status: ${resChat.status}`);
    }
    const chatLogs = await resChat.json();

    const resStudy = await fetch(
      routes.getStudySessions(userId, studySessionId as string)
    );
    if (!resStudy.ok) {
      throw new Error(`API request failed with status: ${resStudy.status}`);
    }
    const studySession = await resStudy.json();

    const resPdfs = await fetch(routes.getPdfs(userId));
    if (!resPdfs.ok) {
      throw new Error(`API request failed with status: ${resPdfs.status}`);
    }
    const userPdfs = await resPdfs.json();

    return { props: { chatLogs, studySession, userPdfs } };
  } catch (error) {
    console.error('API request error:', error);
    return { props: { chatLogs: [] } };
  }
}

export default StudySession;
