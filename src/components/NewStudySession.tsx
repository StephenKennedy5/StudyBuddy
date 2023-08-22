import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

function PopUp({ isCreateNewOpen, setIsCreateNewOpen }) {
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
            onClick={() => console.log({ sessionName, subject })}
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
        />
      ) : null}
    </div>
  );
}

export default NewStudySession;
