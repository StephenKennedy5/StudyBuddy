import * as React from 'react';

import { GetServerSideProps } from 'next';

import StudySessionMap from 'src/components/StudySessionDashboard';
import NewStudySession from 'src/components/NewStudySession';

type StudySessionProps = {
  session_name: string;
  subject: string;
  chat_log_id: string;
  id: string;
};

function dashboard({ studySessions }: StudySessionProps) {
  return (
    <div>
      <div className='flex justify-between px-[30px] py-[30px]'>
        <div>Logo</div>
        <div>LogOut</div>
      </div>
      <div className='mx-auto flex bg-slate-100'>
        <div className='mx-0 h-screen w-[200px] bg-gray-50 p-[20px]'>
          Left Side Add PDFS
        </div>
        <div className='flex h-screen flex-wrap px-[30px] py-[20px]'>
          <div id='DivToFix'>
            <NewStudySession />
          </div>
          <div id='DivToFix'>
            <StudySessionMap StudySessions={studySessions} />
          </div>
        </div>
      </div>
      <div className='px-[30px] py-[40px]'>Footer</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  props: StudySessionProps;
}> = async () => {
  const userId = '1972c0eb-a3ed-4377-b09f-79684995899f';
  const host = 'http://localhost:3000';
  const apiEndpoint = `${host}/api/${userId}/study-sessions`;

  const res = await fetch(apiEndpoint);
  const studySessions = await res.json();

  console.log(studySessions);
  return { props: { studySessions } };
};

export default dashboard;
