// import EmailTemplate from "@/components/email-template";
// import ErrorEmailTemplate from "@/components/error-email";
// import { EmailResponse } from "@/types/response";
// import { Resend } from "resend";

// // Initialize Resend API client with the API key from environment variables
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const Emailer = async ({
//   Data,
//   ErrorTo,
// }: EmailerProps): Promise<EmailResponse> => {
//   if (Data) {
//     // Send the email using the Resend API, with the CSV attached
//     const { data, error } = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>", // Sender's email and name
//       to: ["dawiteliaskassyae@gmail.com"], // Recipient's email
//       subject: "Hi Yoshi✋! This is the Scraped data from your last upload", // Subject of the email
//       react: EmailTemplate({ firstName: "Yoshi" }) as React.ReactElement, // Email content as a React element
//       attachments: [
//         {
//           filename: "final-data.csv", // Name of the file attached
//           content: Buffer.from(Data).toString("base64"), // Convert CSV data to base64 encoding
//           contentType: "text/csv", // MIME type for CSV
//         },
//       ],
//     });
//     const res: EmailResponse = {
//       data: data,
//       error: error,
//     };
//     return res;
//   }
//   if (ErrorTo) {
//     const { data, error } = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>", // Sender's email and name
//       to: ErrorTo, // Recipient's email
//       subject: "🔴Your last scraping request has failed", // Subject of the email
//       react: ErrorEmailTemplate({ firstName: "Yoshi" }) as React.ReactElement, // Email content as a React element
//     });
//     const res: EmailResponse = {
//       data: data,
//       error: error,
//     };
//     return res;
//   }
//   const res: EmailResponse = {
//     data: null,
//     error: null,
//   };
//   return res;
// };
