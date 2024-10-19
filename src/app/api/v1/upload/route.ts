import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";
import { validateData } from "@/lib/helpers";
import Papa from "papaparse";
import logger from "@/lib/logger";

const uploadDir = path.join(process.cwd(), "uploads");

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;
    const storeName = formData.get("storeName") as string;

    logger.info("Received upload request...");

    // Validate input
    if (!file) {
      logger.error("Missing CSV file in the request");
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    if (!email) {
      logger.error("Missing email in the request");
      return NextResponse.json(
        { message: "No email submitted" },
        { status: 400 }
      );
    }
    if (!storeName) {
      logger.error("Missing store name in the request");
      return NextResponse.json(
        { message: "No store name submitted" },
        { status: 400 }
      );
    }

    logger.info("Request validated, proceeding with file processing...");

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, file.name);

    // Save the file locally
    await saveFileLocally(file, filePath);

    logger.info(`Saved CSV file to ${filePath}`);

    // Respond to client
    const uploadResponse = NextResponse.json({
      message: "File uploaded successfully",
    });

    // Perform scraping request asynchronously
    (async () => {
      try {
        logger.info(
          `Sending file path, email, and store name to api/v1/scrape...`
        );
        const url = "http://localhost:3000/api/v1/scrape";
        const response = await axios.post(url, { filePath, email, storeName });

        if (response.status !== 200) {
          logger.error(
            `Failed to send data to scrape API, status: ${response.status}`
          );
        } else {
          logger.info("Data sent to scrape API successfully");
        }
      } catch (error) {
        logger.error(`Error sending data to scrape API: ${error}`);
      }
    })();

    return uploadResponse;
  } catch (error) {
    logger.error("Error handling file upload:", error);
    return NextResponse.json(
      { message: "An error occurred during file upload" },
      { status: 500 }
    );
  }
}

// Helper function to save file locally
async function saveFileLocally(file: File, filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);
    const reader = file.stream().getReader();
    const writer = fileStream;

    (async function pipeStream() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            writer.end();
            resolve();
            break;
          }
          writer.write(value);
        }
      } catch (error) {
        writer.end();
        reject(error);
      }
    })();
  });
}
