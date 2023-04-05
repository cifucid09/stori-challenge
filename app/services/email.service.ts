import nodemailer from "nodemailer";

import { NewsletterTemplateArgs, SendNewsletterTemplateArgs } from "~/types";
import { getFileExtension } from "~/utils";

const emailTransporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // generated ethereal user
    pass: "<API KEY GOES HERE>",
  },
});

export function getNewsletterTemplate({
  dedupe,
  recipientEmail,
}: NewsletterTemplateArgs): string {
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        table, th, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
        <tr>
          <td align="center" style="padding:0;">
            <b>Hi ${recipientEmail}</b>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0;">
            <p>This is the monthly Stori newsletter, enjoy !</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0;">
            <span>Click the link to: <a href="http://localhost:3002/unsubscribe/${dedupe}?link=${recipientEmail}">Unsubscribe</a></span>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export async function sendNewsletter({
  newsletterDedupe,
  recipients,
  newsletterAttachment,
  transporter = emailTransporter,
}: SendNewsletterTemplateArgs) {
  //   let testAccount = await nodemailer.createTestAccount();

  //   console.log("testAccount", testAccount);

  let promises = [];
  for (const recipient of recipients) {
    const htmlTemplateContent = getNewsletterTemplate({
      dedupe: newsletterDedupe,
      recipientEmail: recipient,
    });
    promises.push(
      transporter.sendMail({
        from: '"Challenge" <cienfu09@gmail.com>', // sender address
        to: recipient, // list of receivers
        subject: "Stori Newsletter", // Subject line
        html: htmlTemplateContent, // html body
        attachments: [
          // {   // encoded string as an attachment
          //     filename: 'newsletter.pdf',
          //     content: await blobToBase64(newsletterAttachment),
          //     encoding: 'base64'
          // },
          // {   // data uri as an attachment
          //     path: await blobToBase64(newsletterAttachment, true)
          // },
          {
            // file on disk as an attachment
            filename: `newsletter.${getFileExtension(
              newsletterAttachment.name
            )}`,
            path: newsletterAttachment.getFilePath(),
          },
        ],
      })
    );
  }

  // send mail with defined transport object
  // let info = await

  // console.log("email info", info);

  return Promise.all(promises);
}
