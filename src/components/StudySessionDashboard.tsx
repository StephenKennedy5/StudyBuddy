interface StudySessionProps {
  chat_log_id: string;
  creation_date: string;
  id: string;
  session_name: string;
  subject: string;
  updated_date: string;
  user_id: string;
}

function StudySessionMap({ StudySessions }) {
  console.log('Study Sessions Component');
  console.log(StudySessions);
  return (
    <div>
      <div className=' mx-auto flex  px-[30px] py-[20px]'>
        {StudySessions.map(
          ({ subject, session_name, id }: StudySessionProps) => {
            return (
              <div
                key={id}
                className='flex h-[150px] w-[300px] cursor-pointer flex-col justify-center rounded-[20px] bg-white text-center align-middle'
                onClick={() => console.log({ StudySessionId: id })}
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
