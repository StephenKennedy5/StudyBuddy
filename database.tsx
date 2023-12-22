/*
User Table:
    - ID (UUID)
    - Name (text)
    - Email (text)
    - Creation Date (Timestamp)
    - Updated Date (timeStamp)

PDF Table:
    - ID (UUID)
    - Title (Text)
    - User ID (UUID) (FROM USER TABLE)
    - PDF INFO (Text?)
    - Upload Date (Timestamp)
    - AWS Bucket
    - AWS Key
    - AWS URL

Chat Message Table:
    - ID (UUID)
    - Chat ID (UUID) (FROM CHAT LOGS TABLE)
    - Chat Message (Text)
    - Creation Date (Timestamp)
    - PDF Id
    - user Id
    
*/
