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

Chat Message Table:
    - ID (UUID)
    - Chat ID (UUID) (FROM CHAT LOGS TABLE)
    - Chat Message (Text)
    - Creation Date (Timestamp)
    - PDF Id
    
Pivot Table for StudySession and PDFs
    - ID (UUID)
    - PDF_ID (UUID) (FROM PDF TABLE)
    - Study_Session_ID (UUID) (FROM STUDY SESSION TABLE)

Need to add chat_logs ID to Study Session Table as foreign key

*/

/* 
Tables needed for the many to many table

User Table:
    id (UUID, Primary Key)
    name (Text)
    email (Text)
    creation_date (Timestamp)
    updated_date (Timestamp)

PDF Table:
    id (UUID, Primary Key)
    title (Text)
    user_id (UUID, Foreign Key referencing User.id)
    upload_date (Timestamp)
    pdf_info (Text)

StudySession Table:
    id (UUID, Primary Key)
    user_id (UUID, Foreign Key referencing User.id, allowed to be null)
    session_name (Text)
    subject (Text)
    chat_id (UUID, Foreign Key referencing another table, presumably ChatLogs)
    creation_date (Timestamp)
    updated_date (Timestamp)

PDF_StudySession Relationship Table (pdf_study_session):
    pdf_id (UUID, Foreign Key referencing PDF.id)
    study_session_id (UUID, Foreign Key referencing StudySession.id)
    Composite Primary Key: (pdf_id, study_session_id)
*/
