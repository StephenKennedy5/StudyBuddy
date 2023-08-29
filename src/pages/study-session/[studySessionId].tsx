import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { ParsedUrlQuery } from 'querystring';

import Chat from 'src/components/Chat';
import PDFS from 'src/components/Pdfs';
import NewPdf from 'src/components/newPdf';

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
  return (
    <div>
      <div className='grid grid-cols-3 gap-[20px] px-[20px] py-[10px] sm:grid-cols-5'>
        <Link href='/dashboard'>
          <div className='col-span-1 cursor-pointer bg-blue-200 p-[20px] text-center'>
            Dashboard
          </div>
        </Link>
        <div className='hidden sm:col-span-1 sm:block'></div>
        <div className='col-span-1 flex items-center justify-center p-[10px] text-center'>
          {studySessionName}
        </div>
        <div className='hidden sm:col-span-1 sm:block'></div>
        <div className='col-span-1 flex items-center justify-center'>
          Logout
        </div>
      </div>
      <div className='flex'>
        <div className=' max-w-[40%] bg-blue-300 px-[20px] py-[10px]'>
          <div>
            <NewPdf />
            <PDFS pdfList={userPdfs} />
          </div>
        </div>
        <div className=''>
          <Chat chatMessages={chatLogs} studySessionId={studySession.id} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  chatLogs: ChatLogsProps[];
  studySession: StudySessionProp;
}> = async (context) => {
  const userId = '1972c0eb-a3ed-4377-b09f-79684995899f';
  const host = 'http://localhost:3000';
  const { studySessionId } = context.params as ParsedUrlQuery;
  const apiEndpointChatLogs = `${host}/api/${userId}/study-session/${studySessionId}/chatlogs`;
  const apiEndpointStudySession = `${host}/api/${userId}/study-session/${studySessionId}/getStudySession`;
  const apiEndPointPdfs = `${host}/api/${userId}/getPdfs`;

  try {
    const resChat = await fetch(apiEndpointChatLogs);
    if (!resChat.ok) {
      throw new Error(`API request failed with status: ${resChat.status}`);
    }
    const chatLogs = await resChat.json();

    const resStudy = await fetch(apiEndpointStudySession);
    if (!resStudy.ok) {
      throw new Error(`API request failed with status: ${resStudy.status}`);
    }
    const studySession = await resStudy.json();

    const resPdfs = await fetch(apiEndPointPdfs);
    if (!resPdfs.ok) {
      throw new Error(`API request failed with status: ${resPdfs.status}`);
    }
    const userPdfs = await resPdfs.json();

    return { props: { chatLogs, studySession, userPdfs } };
  } catch (error) {
    console.error('API request error:', error);
    return { props: { chatLogs: [] } };
  }
};

export default StudySession;
