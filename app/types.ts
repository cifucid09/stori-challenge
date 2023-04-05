import nodemailer from "nodemailer";
import { NodeOnDiskFile } from "@remix-run/node";

export const EXTENSIONS_KEYS = ["pdf", "png"] as const;
export type FileExtensions = "pdf" | "png";

export function isValidFileExtension(
  extension: unknown
): extension is FileExtensions {
  console.log("extension", extension);
  return EXTENSIONS_KEYS.includes(extension as FileExtensions);
}

export type NewsletterTemplateArgs = {
  dedupe: string;
  recipientEmail: string;
};

export type SendNewsletterTemplateArgs = {
  newsletterDedupe: string;
  recipients: Array<string>;
  newsletterAttachment: NodeOnDiskFile;
  transporter?: nodemailer.Transporter;
};
