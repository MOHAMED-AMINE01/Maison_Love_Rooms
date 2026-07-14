import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  const mailOptions = {
    from: `Maison Love Rooms <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé : ' + info.response);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    throw error;
  }
};
