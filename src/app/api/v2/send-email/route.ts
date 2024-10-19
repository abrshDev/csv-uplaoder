import { NextResponse } from "next/server";
import { EmailerV2 } from "@/lib/emailer-v2"; // Adjust this path to where your Emailer function is located

// Define the POST request handler for the /api/send-email route
export async function POST(req: Request) {
  try {
    // Parse the request body to get the data and to email
    const { data, to} = await req.json();

    // Validate required fields
    if (!data || !to) {
      return NextResponse.json(
        { error: "Missing required fields: 'data' or 'to'" },
        { status: 400 }
      );
    }

    // Call the Emailer function with the parsed data
    const response = await EmailerV2({
      Data: data,
      To: to,
      Subject:  "Here's your requested data",
      FirstName:  "",
    });

    // Return the response from the Emailer function
    if (response.error?.message !== "") {
      return NextResponse.json(
        { error: response.error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: response.data }, { status: 200 });
  } catch (error) {
    // Handle any errors and return an appropriate error message
    return NextResponse.json(
      { error: (error as any).message || "An internal error occurred" },
      { status: 500 }
    );
  }
}
