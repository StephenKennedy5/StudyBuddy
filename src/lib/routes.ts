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

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL;
const FETCH_CREDENTIALS = process.env.NEXT_PUBLIC_FETCH_CREDENTIALS;
if (!PYTHON_API_URL) {
  throw new Error('need to define NEXT_PUBLIC_PYTHON_API_URL');
}

if (!FETCH_CREDENTIALS) {
  throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
}

export const fetchCreds = FETCH_CREDENTIALS || 'same-origin';

export const routes = {
  login(): string {
    return `${PYTHON_API_URL}/v1/auth/login`;
  },
  createOrderAndPay(): string {
    return `${PYTHON_API_URL}/v1/orders/order-and-pay`;
  },
  createOrderAndPayLoggedIn(userId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders/order-and-pay`;
  },
  uploadPhotos(orderId: string): string {
    return `${PYTHON_API_URL}/v1/orders/${orderId}/upload-photos`;
  },
  getOrderStatus(orderId: string): string {
    return `${PYTHON_API_URL}/v1/orders/${orderId}/status`;
  },
  getAllOrders(userId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders`;
  },
  getResultPhotosAuth(userId: string, orderId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders/${orderId}/result-photos`;
  },
  getResultPhotos(orderId: string): string {
    return `${PYTHON_API_URL}/v1/orders/${orderId}/result-photos`;
  },
  updateResultPhotosPrivate(userId: string, orderId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders/${orderId}/update-result-photos-private`;
  },
  updateEnableBonusContent(userId: string, orderId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders/${orderId}/enable-bonus-content`;
  },
  updateCompleteTrial(userId: string, orderId: string): string {
    return `${PYTHON_API_URL}/v1/users/${userId}/orders/${orderId}/complete-trial`;
  },
};


*/

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FETCH_CREDENTIALS = process.env.NEXT_PUBLIC_FETCH_CREDENTIALS;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

if (!FETCH_CREDENTIALS) {
  throw new Error('need to define NEXT_PUBLIC_FETCH_CREDENTIALS');
}

const fetchCreds = FETCH_CREDENTIALS || 'same-origin';

export const routes = {
  login() {},
};
