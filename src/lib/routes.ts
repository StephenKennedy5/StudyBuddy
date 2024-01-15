const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FETCH_CREDENTIALS = process.env.NEXT_PUBLIC_FETCH_CREDENTIALS;
const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

if (!FETCH_CREDENTIALS) {
  throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
}

if (!fastApiUrl) {
  throw new Error('Need to define NEXT_PUBLIC_FASTAPI_URL');
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
  getS3Link(userId: string, pdfId: string): string {
    return `${baseUrl}/api/${userId}/chat-session/${pdfId}/getPdfFromS3`;
  },
  uploadPdf(): string {
    return `${baseUrl}/api/upload`;
  },
  testRoute(): string {
    return `${fastApiUrl}/api/fastapi/index`;
  },
  scrapePdf(pdfId: string) {
    return `${fastApiUrl}/api/fastapi/pdfScraper/scraper`;
  },
};
