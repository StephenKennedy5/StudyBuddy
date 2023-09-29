/*

User types message in input box
User sends message

User Message is temporarly set to chat messages so it appears as if its been sent
First API endpoint Checks the number of tokens on input message (Limit 1000?)
  if pass continue on to send message to openAI API endpoint
    passes on number of tokens message was
  else Return error and remove from chatlogs on webpage
    should not be stored in database yet

2nd API endpoint Provides context to openAI
  Tells openAI it does an expert is users Subject
  Provides context up to 6 previous messages up to 1000 tokens including chat users current message
  User content count so 4096 - (input + 10) tokens to limit the output response in case of error

3rd API endpoint Insert data into database
  If user submission to openAI goes through and gets recieved
  update both new chat messages to database and update study_session updated_date with new timestamp

*/

/* 

TODO:
  Done 1. Add prompt that user is an expert in particular field 
  Done 2. Add previous message context to message
  Done 3. Have Chat update with user message before its submitted to database
  4. implement tokenizer count to return error message if too long

*/

/* 
https://platform.openai.com/docs/guides/gpt/chat-completions-api
System = Sets the behaviour of the Chat Bot
User = User messages
Assistant = Response by Chat Bot
const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}],
  });

*/
