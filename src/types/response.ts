import { CreateEmailResponseSuccess, ErrorResponse } from "resend";

export type EmailResponse = {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
};
