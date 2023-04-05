// import type { NewsletterSubmission} from "@prisma/client";
// import { nanoid } from "nanoid";

import { prisma } from "~/db.server";

export function createNewsletterToRecipients(
  recipients: Array<string>,
  newsletterSubmissionId: number
) {
  return prisma.newsletterRecipient.createMany({
    data: recipients.map((recipient) => ({
      recipientEmail: recipient,
      newsletterSubmissionId,
    })),
    skipDuplicates: true,
  });
}

export function unsubscribeRecipientFromNewsletter(
  newsLetterId: number,
  recipientEmail: string
) {
  return prisma.newsletterRecipient.update({
    data: { unsubscribed: true, unsubscribedAt: new Date() },
    where: {
      newsletterSubmissionId_recipientEmail: {
        newsletterSubmissionId: newsLetterId,
        recipientEmail,
      },
    },
  });
}

// export function getNewsletterToRecipient()
