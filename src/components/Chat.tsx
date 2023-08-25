/* 
    Component for StudySessions that will display the chat messages
    Will recieve an array of objects that will be sorted based on creation date
    Sort messages based on 2 different UserIDs
    User ID should be a singular background color
    Bot Message should be a different color
    Newest Message will be added to the button of the screen 

*/

import classNames from 'classnames';

import { useState } from 'react';

function Chat({ chatMessages }) {
  const [newQuestion, setNewQuestion] = useState('');

  return (
    <div>
      <div>
        {chatMessages.map(({ chat_message, user_id, id }) => {
          const userId = '1972c0eb-a3ed-4377-b09f-79684995899f';

          // UserId !=
          const UserIdNotEqual = 'bg-blue-50';
          // UserId ==
          const UserIdEqual = 'bg-green-50';
          // Base Styling
          const chatMessageBase = 'px-[40px] py-[20px] ';

          const chatMessageCls = classNames({
            [chatMessageBase]: true,
            [UserIdEqual]: userId == user_id,
            [UserIdNotEqual]: userId != user_id,
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
          />
          {/* Set Onclick to Call API endpoint of new chat message
          Make mock response message to act like real convo in which messages arrives 5 secs later */}
          <div
            className='ml-[10px] bg-blue-100 px-[20px] py-[10px]'
            onClick={() => {
              console.log(newQuestion), setNewQuestion('');
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
