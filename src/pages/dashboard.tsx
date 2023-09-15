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

function dashboard({ studySessions, userPdfs }: StudySessionArray) {
  const [showPdfs, setShowPdfs] = useState(true);
  const { data: session, status } = useSession();

  console.log({ session });
  console.log({ status });

  return (
    <div>
      <div className='flex justify-between px-[30px] py-[30px]'>
        <div>Logo</div>
        <div>Welcome User</div>
        <div
          onClick={() => signOut({ callbackUrl: '/' })}
          className='cursor-pointer bg-blue-50 p-[20px]'
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
          <div>
            <PDFS pdfList={userPdfs} />
          </div>
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

          <div>
            <StudySessionMap
              StudySessions={studySessions}
              showPdfs={showPdfs}
            />
          </div>
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

  const userId = '1972c0eb-a3ed-4377-b09f-79684995899f';
  const host = 'http://localhost:3000';
  const apiEndpoint = `${host}/api/${userId}/study-sessions`;
  const apiEndPointPdfs = `${host}/api/${userId}/getPdfs`;

  const res = await fetch(apiEndpoint);
  const studySessions = await res.json();

  const resPdfs = await fetch(apiEndPointPdfs);
  if (!resPdfs.ok) {
    throw new Error(`API request failed with status: ${resPdfs.status}`);
  }
  const userPdfs = await resPdfs.json();

  return { props: { studySessions, userPdfs } };
}

export default dashboard;
