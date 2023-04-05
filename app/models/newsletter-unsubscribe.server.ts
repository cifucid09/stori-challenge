// import type { NewsletterSubmission} from "@prisma/client";
// import { nanoid } from "nanoid";

import { prisma } from "~/db.server";

export function unsubscribeARecipient(recipientEmail: string) {
  return prisma.newsletterUnsubscribed.create({
    data: {
      recipientEmail,
    },
  });
}

export function getUnsubscribedRecipients(recipients: Array<string>) {
  return prisma.newsletterUnsubscribed.findMany({
    where: { recipientEmail: { in: [...recipients] } },
  });
}
