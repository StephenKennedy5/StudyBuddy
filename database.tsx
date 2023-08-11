/*
User Table:
    - ID (UUID)
    - Name (text)
    - Email (text)
    - PDF ID (UUID) Remove? A user wont 
        just have a singular PDF ID but should have lots of them
    - Creation Date (Timestamp)
    - Updated Date (timeStamp)

Study Session Table:
    - ID (UUID) 
    - User ID (UUID) (FROM USER TABLE) (allowed to be null)
    - Session Name (Text)
    - Subject (Text)
    - Chat ID (UUID) (FROM CHAT LOGS TABLE)
    - PDF ID (UUID) (FROM PDF TABLE)
    - Creation Date (Timestamp)
    - Updated Date (Timestamp)


PDF Table:
    - ID (UUID)
    - Title (Text)
    - User ID (UUID) (FROM USER TABLE)
    - Upload Date (Timestamp)
    - PDF INFO (Text?)

Chat Logs Table:
    - ID (UUID)
    - Session ID (UUID) (FROM STUDY SESSION TABLE)
    - Chat Message ID (UUID) (FROM CHAT MESSAGE TABLE)
    - Field (Text)
    - Creation Date (Timestamp)
    - Updated Date (Timestamp)

Chat Message Table:
    - ID (UUID)
    - Chat ID (UUID) (FROM CHAT LOGS TABLE)
    - Chat Message (Text)
    - Creation Date (Timestamp)

*/
