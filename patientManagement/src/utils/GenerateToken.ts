import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';
dotenv.config();
const { OAuth2 } = google.auth;

// Replace these with your credentials from Google Cloud Console
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET ;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

function getAccessToken(): void {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', async (code: string) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('Tokens acquired:', tokens);
      rl.close();
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      rl.close();
    }
  });
}

getAccessToken();
