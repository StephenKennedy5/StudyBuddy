import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function PopUp({ isCreateNewOpen, setIsCreateNewOpen, router }) {
  const [subject, setSubject] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [newStudySessionValidation, setNewStudySessionValidation] =
    useState(false);

  const CreateButtonBase =
    'mx-auto cursor-pointer px-[20px] py-[10px] text-center';
  const CreateButtonFalse = 'bg-slate-50';
  const CreateButtonTrue = 'bg-green-100';

  const CreateButtonCls = classNames({
    [CreateButtonBase]: true,
    [CreateButtonFalse]: !newStudySessionValidation,
    [CreateButtonTrue]: newStudySessionValidation,
  });

  useEffect(() => {
    if (subject.trim() !== '' && sessionName.trim() !== '') {
      setNewStudySessionValidation(true);
    } else {
      setNewStudySessionValidation(false);
    }
  }, [subject, sessionName]);

  const CreateNewStudySesssion = async () => {
    if (!newStudySessionValidation) return;

    const session_name = sessionName;

    const requestBody = {
      session_name,
      subject,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/${process.env.NEXT_PUBLIC_USER_ID}/new-study-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        const jsonResponse = await response.json(); // Parse the JSON response
        const { studySessionId } = jsonResponse;
        setIsCreateNewOpen(!isCreateNewOpen);
        // Perform any other necessary actions

        router.push(`/study-session/${studySessionId}`);
      } else {
        console.error('Failed to Create Study Session');
      }
    } catch (error) {
      console.error('Error Making Study Session: ', error);
    }
  };

  return (
    <div className='flex justify-end'>
      <div
        className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform bg-gray-200 p-8'
        onClick={() => setIsCreateNewOpen(!isCreateNewOpen)}
      >
        <div
          className='cursor-default rounded bg-white p-[20px]'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='py-[20px]'>
            Subject:{' '}
            <input
              type='text'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className='py-[20px]'>
            Session Name:{' '}
            <input
              type='text'
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>
          <div
            className={CreateButtonCls}
            onClick={() => CreateNewStudySesssion()}
          >
            Create
          </div>
        </div>
      </div>
    </div>
  );
}

function NewStudySession() {
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const router = useRouter();

  return (
    <div className=' mx-auto flex'>
      <div
        onClick={() => {
          setIsCreateNewOpen(!isCreateNewOpen);
        }}
        className={`
                  group mx-[20px] mb-[20px] flex h-[150px] w-[250px] transform cursor-pointer
                  flex-col justify-center rounded-[20px] bg-white p-[20px] text-center align-middle transition
                  duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg
                `}
      >
        Create a New Study Session
      </div>
      {isCreateNewOpen ? (
        <PopUp
          isCreateNewOpen={isCreateNewOpen}
          setIsCreateNewOpen={setIsCreateNewOpen}
          router={router}
        />
      ) : null}
    </div>
  );
}

export default NewStudySession;
