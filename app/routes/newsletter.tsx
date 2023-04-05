import {
  ActionFunction,
  MetaFunction,
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  NodeOnDiskFile,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
// import { zfd } from "zod-form-data";

import { sendNewsletter } from "~/services/email.service";
import {
  getRecipientsFinalList,
  saveNewsletterSubmission,
} from "~/services/newsletter.service";
import { isValidFileExtension } from "~/types";
import { getFileExtension } from "~/utils";

// const schema = zfd.formData({
//   recipients: zfd.text(),
//   newsletterFile: zfd.file(),
// });

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
    }),
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  //   console.log("--formData", Object.fromEntries(formData));

  const recipients = formData.get("recipients") as string;
  const newsletterFileAttachment = formData.get(
    "newsletterFile"
  ) as unknown as NodeOnDiskFile;

  // Validate file extension is truly the one we expect
  if (!isValidFileExtension(getFileExtension(newsletterFileAttachment.name))) {
    return json({ error: "File extension not supported, only PDF or PNG." });
  }

  const recipientsFinalList = await getRecipientsFinalList(
    recipients.split(",")
  );

  // Oh, what if all recipients are unsubscribed
  if (recipientsFinalList.length === 0) {
    return json({
      error:
        "Oh looks like ALL recipients are unsubscribed, no one else to send?",
    });
  }

  const saveResult = await saveNewsletterSubmission(
    recipientsFinalList,
    newsletterFileAttachment
  );

  const { newsletterResult } = saveResult;

  const mailInfo = await sendNewsletter({
    newsletterDedupe: newsletterResult.dedupe,
    recipients: recipientsFinalList,
    newsletterAttachment: newsletterFileAttachment,
  });

  console.log("mailInfo", mailInfo);

  //   return json({ success: true, file: newsletterFileAttachment.name });
  return redirect("/");
};

export const meta: MetaFunction = () => {
  return {
    title: "Newsletter Form",
  };
};

export default function Newsletter() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const hasError = !!actionData?.error;
  const isSubmitting = navigation.state === "submitting";
  const submitButtonLabel = isSubmitting ? "Sending ..." : "Send Newsletter";

  //   console.log("actionData", actionData);

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="m-auto w-full rounded-md bg-white p-6 shadow-xl ring-2 ring-indigo-600 md:w-2/3 lg:max-w-xl">
        <h1 className="mb-6 text-center text-3xl font-semibold uppercase text-indigo-700 underline decoration-dotted">
          Newsletter Form
        </h1>
        <Form method="post" encType="multipart/form-data">
          {/** this could be a component */}
          <div className="mb-6">
            <label
              htmlFor="recipients"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Recipients
            </label>
            <input
              name="recipients"
              id="recipients"
              type="email"
              multiple
              required
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="john.cooks@example.com, another_comma_separated@email.com, ..."
            />
          </div>

          <div className="mb-6">
            {/** This could look nicer with react dropzone */}
            <label
              className="block text-sm font-medium leading-6 text-gray-900"
              htmlFor="newsletterFile"
            >
              Upload file
            </label>
            <input
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              aria-describedby="newsletterFileHelp"
              name="newsletterFile"
              id="newsletterFile"
              type="file"
              required
              accept="image/png, application/pdf"
            />
            <p className="mt-1 text-sm text-gray-500" id="newsletterFileHelp">
              PDF or PNG / Max Size 3MB.
            </p>
          </div>
          {hasError /** This could be a component */ && (
            <div className="mb-2">
              <p className="text-xs italic text-red-500">{actionData.error}</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              disabled={isSubmitting}
              type="submit"
              className="
                focus:shadow-outline
                h-10
                rounded-lg
                bg-blue-700
                px-5
                text-indigo-100
                transition-colors
                duration-150
                hover:bg-blue-800
                disabled:opacity-25
                "
            >
              {submitButtonLabel}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
