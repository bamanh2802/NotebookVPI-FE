import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'b4d2901e-f89a-4445-ac67-79c95ac0dc17', // Thay thế bằng client ID của bạn
    authority: 'https://login.microsoftonline.com/fa31a4b9-8bae-42ac-9e7a-6553ded13bc1', // Thay thế bằng tenant ID của bạn (hoặc sử dụng 'common' cho đa tenant)
    redirectUri: 'http://127.0.0.1:3000/', // Thay thế bằng URL redirect của bạn
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsalInstance = async () => {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
  } catch (error) {
    console.error('Error initializing MSAL instance:', error);
  }
};