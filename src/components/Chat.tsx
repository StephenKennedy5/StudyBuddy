import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

function Chat({ chatMessages, studySessionId }) {
  const [newQuestion, setNewQuestion] = useState('');
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  const [chatMessagesState, setChatMessages] = useState(chatMessages);

  const sumbitNewChatMessage = async () => {
    if (newQuestion.trim() === '') return;

    const requestBody = { chat_message: newQuestion };

    try {
      const response = await fetch(
        routes.newChatMessage(userId, studySessionId),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        console.log('Chat messag sent successfully');
        const newMessage = await response.json();
        setChatMessages(() => [...newMessage]);
        setNewQuestion('');
        // Perform any other necessary actions
      } else {
        console.error('chat messaged failed to upload');
      }
    } catch (error) {
      console.error('Error uploading chat message: ', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sumbitNewChatMessage();
    }
  };

  return (
    <div>
      <div>
        {chatMessagesState.map(({ chat_message, id }) => {
          // UserId !=
          const UserIdNotEqual = 'bg-blue-50';
          // UserId ==
          const UserIdEqual = 'bg-green-50';
          // Base Styling
          const chatMessageBase = 'px-[40px] py-[20px] ';

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
      <div className='mt-[20px] bg-green-50 px-[40px] py-[20px]'>
        <div className='flex'>
          <input
            type='text'
            value={newQuestion}
            onChange={(e) => {
              setNewQuestion(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          {/* Set Onclick to Call API endpoint of new chat message
          Make mock response message to act like real convo in which messages arrives 5 secs later */}
          <div
            className='ml-[10px] bg-blue-100 px-[20px] py-[10px]'
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
