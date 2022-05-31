import { resetPasswordEmailTemplate } from './resetPasswordEmailTemplate';
export const sendEmailReset = ({ email, link }: { email: string; link: string }) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'guidezephyr@gmail.com',
      pass: '@dmin123&',
    },
  });
  const mailOptions = {
    from: 'guidezephyr@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Votre compte GuideZephir', // Subject line
    html: resetPasswordEmailTemplate({
      link,
    }),
    attachments: [
      {
        filename: 'logoZephirWhite.svg',
        path: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2FPackfast.livraison%2F&psig=AOvVaw34s4G68EitmjGeUBkDfGbk&ust=1644918950160000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCODY-9_2_vUCFQAAAAAdAAAAABAD',
      },
    ], // plain text body
  };
  transporter.sendMail(mailOptions, function (err: any) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email Sended');
    }
  });
};
