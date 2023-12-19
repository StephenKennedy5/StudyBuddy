/* 

    Index -> Login -> Dashboard

    Dashboard will take GetStudySessions API Call and GET PDFs API call to populate dashboard

    Dashboard will have Study Session ID ready to route to individual Study Session. 

    On study Session Page User will get history of chat logs of convo


    Create Routes that will be used in API Calls to gather info from the database

    Get Study Sessions 
        Takes
            - Has UserID
        Return
            - Array of Dics of Study Sessions for particular User
            [
                {
                    StudySession: Text
                    Subject: Text
                    chat_log_id: UUID
                },
                {
                    StudySession: Text
                    Subject: Text
                    chat_log_id: UUID
                }
            ]


*/

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FETCH_CREDENTIALS = process.env.NEXT_PUBLIC_FETCH_CREDENTIALS;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

if (!FETCH_CREDENTIALS) {
  throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
}

export const fetchCreds = FETCH_CREDENTIALS || 'same-origin';

export const routes = {
  login(): string {
    return `${baseUrl}/api/login`;
  },
  getStudySession(userId: string): string {
    return `${baseUrl}/api/${userId}/study-sessions`;
  },
  getPdfs(userId: string): string {
    return `${baseUrl}/api/${userId}/getPdfs`;
  },
  createUser(): string {
    return `${baseUrl}/api/createUser`;
  },
  newStudySession(userId: string): string {
    return `${baseUrl}/api/${userId}/new-study-session`;
  },
  getChatLogs(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/chatLogs`;
  },
  getStudySessions(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/getStudySession`;
  },
  newChatMessage(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/newChatMessage`;
  },
  newPdf(userId: string): string {
    return `${baseUrl}/api/${userId}/newPdf`;
  },
  openAiMessage(): string {
    return `${baseUrl}/api/openAiMessage`;
  },
  getSixLatestMessages(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/getSixChatMessages`;
  },
  getPdfName(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/getPdfName`;
  },
  getPdfInfo(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/getPdfFromS3`;
  },
  uploadPdf(): string {
    return `${baseUrl}/api/upload`;
  },
};
