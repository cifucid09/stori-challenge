import { MetaFunction, json, LoaderArgs, TypedResponse } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { getNewsletterSubmission } from "~/models/newsletter.server";
import { unsubscribeRecipient } from "~/services/newsletter.service";

export async function loader({
  params,
  request,
}: LoaderArgs): Promise<
  TypedResponse<{ success?: boolean; message?: string; error?: string }>
> {
  const dedupeHash = params.unsubscribeId;
  const url = new URL(request.url);
  const recipientEmailParam = url.searchParams.get("link");
  // TODO: We could use a schema validator, JOI, ZOD, etc
  try {
    if (!dedupeHash) {
      throw new Error("Hash not found");
    }

    const newsletterSubmissionResult = await getNewsletterSubmission(
      dedupeHash
    );

    if (!newsletterSubmissionResult) {
      throw new Error("Newsletter not found");
    }

    const recipientMatch = newsletterSubmissionResult.NewsletterRecipient.find(
      (recipient) => recipient.recipientEmail === recipientEmailParam
    );
    if (!recipientMatch) {
      throw new Error(
        `No matching recipient for email = ${recipientEmailParam}`
      );
    }

    if (recipientMatch.unsubscribed) {
      throw new Error(
        `Recipient for email = ${recipientEmailParam} already unsubscribed`
      );
    }

    const unsubscribeResult = await unsubscribeRecipient(
      recipientMatch.newsletterSubmissionId,
      recipientMatch.recipientEmail
    );

    console.log("unsubscribeResult", unsubscribeResult);

    return json({
      success: true,
      message: "You have successfully unsubscribe from Stori newsletter !",
    });
  } catch (error) {
    console.error("Error with unsubscribe process", error);
    return json({
      error:
        "Something happened and we could not process the unsubscription, please try again !",
    });
  }
}

export const meta: MetaFunction = () => {
  return {
    title: "Unsubscribed Notice",
  };
};

export default function Unsubscribe() {
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();

  const hasError = !!data?.error;
  const isLoading = navigation.state === "loading";
  const resultMessage = isLoading
    ? "Loading ..."
    : data?.message || data?.error;

  // console.log("navigation:data", navigation, data);

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="m-auto w-full rounded-md bg-white p-6 shadow-xl md:w-2/3 lg:max-w-xl">
        <h1 className="mb-6 text-center text-3xl font-semibold uppercase text-indigo-700 underline decoration-dotted">
          Unsubscribed
        </h1>
        <div className="mb-6">
          <div className="mb-2 text-center">
            <p
              className={classNames("text-xs italic", {
                "text-red-500": hasError,
              })}
            >
              {resultMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
