import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import UserAgent from "user-agents";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Only handle routes starting with /api/scrape
  if (path.startsWith("/api/scrape")) {
    // Scrape.do proxy API endpoint
    const scrapeDoUrl = `${process.env.SCRAPE_DO_US_ENDPOINT}/${path.replace(
      "/api/scrape",
      ""
    )}`;

    // Generate a random User-Agent to evade detection
    const userAgent = new UserAgent().toString();

    // Scrape.do parameters (assuming US geo-code is default)
    const targetUrl = encodeURIComponent(scrapeDoUrl);
    const geoCode = "us";
    const token = process.env.SCRAPE_DO_API_KEY;

    const config = {
      method: request.method || "GET", // Use the method from the request
      url: `https://api.scrape.do?token=${token}&url=${targetUrl}&geoCode=${geoCode}`,
      headers: {
        "User-Agent": userAgent, // Random User-Agent for each request
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com", // Simulate a search engine as referrer
        "Accept-Encoding": "gzip, deflate, br", // Simulate real browser encoding
        Authorization: `Bearer ${process.env.SCRAPE_DO_API_KEY}`,
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
      },
      data: request.body ? JSON.parse(request.body.toString()) : undefined,
    };

    try {
      // Make the axios request to Scrape.do with stealth evasion
      const response = await axios(config);

      // Return the response back to the client
      return NextResponse.json(response.data);
    } catch (error) {
      console.error("Scrape.do request failed:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Scrape.do" },
        { status: 500 }
      );
    }
  }

  // Continue to the next middleware or API if the route doesn't match
  return NextResponse.next();
}
