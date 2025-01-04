import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const transport = nodemailer.createTransport({
    auth: {
        type: 'OAuth2',
        user: 'sem5pi2425g051@gmail.com',
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
    },
} as nodemailer.TransportOptions);

export async function sendEmail(options: nodemailer.SendMailOptions) {
    return await transport.sendMail(options);
}
