import nodemailer from 'nodemailer';
import { google, gmail_v1 } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import mailcomposer from 'mailcomposer';

const { OAuth2 } = google.auth;

// Configure OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const getMailService = () => {
    return google.gmail({ version: 'v1', auth: oauth2Client });
};
export async function sendEmailWithAttachmentUsingGmailApi(
    toEmail: string,
    subject: string,
    htmlBody: string,
    attachmentBytes: Buffer,
    attachmentFileName: string
) {
    const service = getMailService();

    const mail = mailcomposer({
        from: 'sem5pi2425g051@gmail.com',
        to: toEmail,
        subject: subject,
        html: htmlBody,
        attachments: [
            {
                filename: attachmentFileName,
                content: attachmentBytes,
                contentType: 'application/zip',
            },
        ],
    });


    const rawMessage = await new Promise<string>((resolve, reject) => {
        mail.build((err, message) => {
            if (err) {
                reject(err);
            } else {
                const base64EncodedMessage = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, ''); // Gmail-compatible Base64
                resolve(base64EncodedMessage);
            }
        });
    });

    const gmailMessage: gmail_v1.Schema$Message = { raw: rawMessage };


    await service.users.messages.send({
        userId: 'me',
        requestBody: gmailMessage,
    });

    console.log('Email sent with attachment!');
}

