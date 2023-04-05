// import type { NewsletterSubmission} from "@prisma/client";
// import { nanoid } from "nanoid";

import { prisma } from "~/db.server";

export function createNewsletterSubmission(uploadedFileName: string) {
  return prisma.newsletterSubmission.create({
    data: {
      dedupe: `${new Date().getTime()}`,
      uploadedFileName,
    },
  });
}

export function getNewsletterSubmission(dedupe: string) {
  return prisma.newsletterSubmission.findFirst({
    where: { dedupe },
    include: { NewsletterRecipient: true },
  });
}
