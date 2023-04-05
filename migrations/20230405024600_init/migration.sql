-- CreateTable
CREATE TABLE "newsletter_submission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dedupe" TEXT NOT NULL,
    "uploadedFileName" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "newsletter_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipient" (
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipient_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "newsletter_unsubscribed" (
    "recipientEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_unsubscribed_pkey" PRIMARY KEY ("recipientEmail")
);

-- CreateTable
CREATE TABLE "newsletter_recipient" (
    "newsletterSubmissionId" INTEGER NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "newsletter_recipient_pkey" PRIMARY KEY ("newsletterSubmissionId","recipientEmail")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipient_email_key" ON "recipient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_unsubscribed_recipientEmail_key" ON "newsletter_unsubscribed"("recipientEmail");

-- AddForeignKey
ALTER TABLE "newsletter_unsubscribed" ADD CONSTRAINT "newsletter_unsubscribed_recipientEmail_fkey" FOREIGN KEY ("recipientEmail") REFERENCES "recipient"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_recipient" ADD CONSTRAINT "newsletter_recipient_newsletterSubmissionId_fkey" FOREIGN KEY ("newsletterSubmissionId") REFERENCES "newsletter_submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_recipient" ADD CONSTRAINT "newsletter_recipient_recipientEmail_fkey" FOREIGN KEY ("recipientEmail") REFERENCES "recipient"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
