// import type { NewsletterSubmission} from "@prisma/client";
// import { nanoid } from "nanoid";

import { prisma } from "~/db.server";

export function createManyRecipients(recipients: Array<string>) {
  return prisma.recipient.createMany({
    data: recipients.map((recipient) => ({ email: recipient })),
    skipDuplicates: true,
  });
}
