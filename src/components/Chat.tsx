import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

interface ChatMessageProps {
  id: string;
  chat_message: string;
}

interface StudySessionIdProps {
  StudySessionId: string;
}
interface ChatProps {
  chatMessages: ChatMessageProps[];
  studySessionId: StudySessionIdProps;
}

function Chat({ chatMessages, studySessionId }: ChatProps) {
  const [newQuestion, setNewQuestion] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);
  const [textareaRows, setTextareaRows] = useState(1);

  const maxLines = 3;
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  const [chatMessagesState, setChatMessages] = useState(chatMessages);

  const sumbitNewChatMessage = async () => {
    if (newQuestion.trim() === '') return;

    const requestBody = { chat_message: newQuestion };

    // try {
    //   const response = await fetch(
    //     routes.newChatMessage(userId, studySessionId),
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestBody),
    //     }
    //   );
    //   if (response.ok) {
    //     console.log('Chat message sent successfully');
    //     const newMessage = await response.json();
    //     setChatMessages(() => [...newMessage]);
    //     setNewQuestion('');
    //     // Perform any other necessary actions
    //   } else {
    //     console.error('Chat message failed to upload');
    //   }
    // } catch (error) {
    //   console.error('Error uploading chat message: ', error);
    // }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the input value
    setNewQuestion(e.target.value);

    // Check if the input has more lines than maxLines
    const lines = e.target.value.split('\n');
    const newRows = Math.min(maxLines, Math.max(1, lines.length));
    setTextareaRows(newRows);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sumbitNewChatMessage();
    }
  };

  return (
    <div className='flex flex-col justify-between'>
      <div>
        {chatMessagesState.map(({ chat_message, id }) => {
          // UserId !=
          const UserIdNotEqual = 'bg-blue-50';
          // UserId ==
          const UserIdEqual = 'bg-green-50';
          // Base Styling
          const chatMessageBase = 'px-[100px] py-[20px] ';

          const chatMessageCls = classNames({
            [chatMessageBase]: true,
            [UserIdEqual]: userId == userId,
            [UserIdNotEqual]: userId != userId,
          });
          return (
            <div key={id} className={chatMessageCls}>
              <div>{chat_message}</div>
            </div>
          );
        })}
      </div>
      <div className='bg-green-50 px-[40px] pb-[20px] pt-[40px]'>
        <div className='mx-auto flex max-w-[650px] items-center'>
          {/* Use a container div to create the input box */}
          <div className='relative flex-1'>
            <textarea
              value={newQuestion}
              placeholder='Ask Question Here'
              onChange={handleInputChange} // Use the updated change handler
              onKeyDown={handleKeyDown}
              rows={textareaRows} // Set the number of rows dynamically
              className={`focus:ring-mainBlue border-lightBlue flex w-full resize-none items-center rounded-lg border bg-white px-[40px] py-[10px] focus:outline-none focus:ring-2 ${
                textareaRows >= maxLines ? 'overflow-y-auto' : ''
              }`} // Apply dynamic styles for overflow and height
            />
          </div>
          {/* Set onClick to call the API endpoint of a new chat message */}
          {/* Make a mock response message to act like a real conversation in which messages arrive 5 seconds later */}
          <div
            className='bg-mainBlue hover:bg-lightBlue ml-2 cursor-pointer rounded-full px-[20px] py-[10px] text-center text-white'
            onClick={() => {
              sumbitNewChatMessage();
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;
