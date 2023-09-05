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
}

function StudySessionMap({ StudySessions, showPdfs }: StudySessionMapsProps) {
  const router = useRouter();

  const StudySessionMapBase =
    'flex flex-wrap justify-evenly px-[30px] py-[20px] mx-[50px]';
  const StudySessionMapPdfTrue = '';
  const StudySessionMapPdfFalse = '';

  const StudySessionMapCls = classNames({
    [StudySessionMapBase]: true,
    [StudySessionMapPdfTrue]: showPdfs,
    [StudySessionMapPdfFalse]: !showPdfs,
  });

  return (
    <div>
      <div className={StudySessionMapCls}>
        <div className=''>
          <NewStudySession />
        </div>
        {StudySessions.map(
          ({ subject, session_name, id }: StudySessionProps) => {
            return (
              <div
                key={id}
                className={`
                  group mx-[20px] mb-[20px] flex h-[150px] w-[250px] transform cursor-pointer
                  flex-col justify-center rounded-[20px] bg-white p-[20px] text-center align-middle transition
                  duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg
                `}
                onClick={() => router.push(`/study-session/${id}`)}
              >
                <div className='p-[10px]'>{subject}</div>
                <div className='p-[10px]'>{session_name}</div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default StudySessionMap;
