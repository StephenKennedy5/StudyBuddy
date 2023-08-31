import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

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
    console.log('Calling Create New Study Session');
    if (!newStudySessionValidation) return;
    console.log('AFTER IF STATEMENT');

    const session_name = sessionName;
    console.log({ session_name });
    console.log({ subject });

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
        console.log('Study Session Successfully Made');
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
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-gray-200 p-8'
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
    <div className=' mx-auto flex  px-[30px] py-[20px]'>
      <div
        onClick={() => {
          setIsCreateNewOpen(!isCreateNewOpen);
        }}
        className='flex h-[150px] w-[300px] cursor-pointer flex-col justify-center rounded-[20px] bg-white text-center align-middle'
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