import CryptoJS from 'crypto-js';
import { IronSession } from 'iron-session';


export const generateSessionSignature = (sessionId: string) => {
  const secretKey: string | undefined = process.env.TOKEN_SECRET;

  if (!secretKey) {
    throw new Error('TOKEN_SECRET is not defined in environment variables');
  }

  const signature = CryptoJS.HmacSHA256(sessionId, secretKey).toString();

  return signature;
};

export const generateGuestSessionId = () => {
  return Math.random().toString(36) + Date.now().toString(36);
};

export const verifySessionId = (
  sessionId: string,
  sessionSignature: string,
) => {
  if (!sessionSignature) {
    return false;
  }
  const expectedSignature = generateSessionSignature(sessionId);

  return expectedSignature === sessionSignature;
};

export const sessionOptions = {
  password: process.env.TOKEN_SECRET as string, // Ensure TOKEN_SECRET is defined in .env
  cookieName: 'guest-session',
  cookieOptions: {
    secure: true, // Use HTTPS in production
    httpOnly: true, // Prevent client-side access
  },
};

export interface SessionData {
  guestSessionId?: string;
}

export type IronSessionWithSessionData = IronSession<any> & SessionData;
