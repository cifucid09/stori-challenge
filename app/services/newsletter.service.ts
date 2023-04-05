import { NodeOnDiskFile } from "@remix-run/node";
import {
  createNewsletterToRecipients,
  unsubscribeRecipientFromNewsletter,
} from "~/models/newsletter-recipient.server";
import {
  getUnsubscribedRecipients,
  unsubscribeARecipient,
} from "~/models/newsletter-unsubscribe.server";
import { createNewsletterSubmission } from "~/models/newsletter.server";
import { createManyRecipients } from "~/models/recipient.server";

export async function saveNewsletterSubmission(
  recipients: Array<string>,
  newsletterFileAttachment: NodeOnDiskFile
) {
  // We should use a transaction for this....
  // We add the new submission
  // TODO: Check this https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
  const newsletterResult = await createNewsletterSubmission(
    newsletterFileAttachment.name
  );

  //   console.log("submissionResult", newsletterResult);

  const recipientsResult = await createManyRecipients(recipients);

  //   console.log("recipientsResult", recipientsResult);

  const submissionRecipientsResult = await createNewsletterToRecipients(
    recipients,
    newsletterResult.id
  );

  //   console.log("submissionRecipientsResult", submissionRecipientsResult);

  return { newsletterResult, recipientsResult, submissionRecipientsResult };
}

export async function unsubscribeRecipient(
  newsLetterId: number,
  recipientEmail: string
) {
  // Unsubscribe from newsletter
  const unsubscribeResult = await unsubscribeRecipientFromNewsletter(
    newsLetterId,
    recipientEmail
  );

  console.log("unsubscribeResult", unsubscribeResult);

  // Unsubscribe reference table
  const unsubscribedRecipientResult = await unsubscribeARecipient(
    recipientEmail
  );

  console.log("unsubscribedRecipientResult", unsubscribedRecipientResult);

  return { unsubscribeResult, unsubscribedRecipientResult };
}

export async function getRecipientsFinalList(recipients: Array<string>) {
  const unsubscribedRecipients = await getUnsubscribedRecipients(recipients);
  // We really ony need the emails
  const parsedUnsubscribedRecipients = unsubscribedRecipients.map(
    (recipientUns) => recipientUns.recipientEmail
  );

  console.log("unsubscribedRecipients", unsubscribedRecipients);

  return recipients.filter(
    (recipient) => !parsedUnsubscribedRecipients.includes(recipient)
  );
}
