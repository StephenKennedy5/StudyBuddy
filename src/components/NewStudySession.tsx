import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

interface NewStudySessionProps {
  id: string;
}

function Modal({ isCreateNewOpen, setIsCreateNewOpen, router, id }) {
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
      const response = await fetch(routes.newStudySession(id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
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
    <div
      onClick={() => setIsCreateNewOpen(!isCreateNewOpen)}
      className='fixed inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50'
    >
      <div className='p-8'>
        <div
          className='flex flex-col items-center justify-center rounded bg-white p-4'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='py-4'>
            Subject:{' '}
            <input
              type='text'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className='py-4'>
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

function NewStudySession({ id }) {
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const router = useRouter();
  return (
    <div className=' mx-auto flex'>
      <div
        onClick={() => {
          setIsCreateNewOpen(!isCreateNewOpen);
        }}
        className={`
                  group mx-[20px] mb-[20px] flex h-[150px] w-[250px] transform cursor-pointer flex-col justify-center rounded-[20px]
                  bg-white p-[20px] text-center align-middle text-[18px] font-bold leading-normal transition
                  duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg
                `}
      >
        Create a New Study Session
      </div>
      {isCreateNewOpen ? (
        <Modal
          isCreateNewOpen={isCreateNewOpen}
          setIsCreateNewOpen={setIsCreateNewOpen}
          router={router}
          id={id}
        />
      ) : null}
    </div>
  );
}

export default NewStudySession;
