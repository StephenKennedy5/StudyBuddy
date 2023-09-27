import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NewStudySession from 'src/components/NewStudySession';

interface StudySessionProps {
  chat_log_id: string;
  creation_date: string;
  id: string;
  session_name: string;
  subject: string;
  updated_date: string;
  user_id: string;
}

interface StudySessionMapsProps {
  StudySessions: StudySessionProps[];
  showPdfs: boolean;
  id: string;
}

function StudySessionMap({
  StudySessions,
  showPdfs,
  id,
}: StudySessionMapsProps) {
  const router = useRouter();

  const StudySessionMapBase =
    'flex flex-wrap justify-evenly px-[30px] py-[20px] mx-[50px] max-w-[700px]';
  const StudySessionMapPdfTrue = '';
  const StudySessionMapPdfFalse = ' ';
  const StudySessionAnimation = '';

  const StudySessionMapCls = classNames({
    [StudySessionMapBase]: true,
    [StudySessionMapPdfTrue]: showPdfs,
    [StudySessionMapPdfFalse]: !showPdfs,
  });

  return (
    <div className=''>
      <div className={StudySessionMapCls}>
        <div className=''>
          <NewStudySession id={id} />
        </div>
        {StudySessions.map(
          ({ subject, session_name, id }: StudySessionProps) => {
            return (
              <div
                key={id}
                className={`
                  group mx-[20px] mb-[20px] flex h-[150px] w-[250px] transform cursor-pointer
                  flex-col justify-center rounded-[20px] bg-white p-[20px] text-center align-middle transition
                  duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-200
                `}
                onClick={() => router.push(`/study-session/${id}`)}
              >
                <div className='p-[10px] text-[18px] font-bold leading-normal'>
                  {subject}
                </div>
                <div className='p-[10px] text-[16px] font-semibold leading-normal'>
                  {session_name}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default StudySessionMap;
