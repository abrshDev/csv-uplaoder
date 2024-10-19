import { describe, it, expect, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { POST } from "@/app/api/upload/route";

const mockFilePath = path.join(__dirname, "mock_uploads", "testfile.csv");
const mockUploadDir = path.join(__dirname, "mock_uploads");

// Mock the file system
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    end: jest.fn(),
  })),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));

// Mock axios
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200 }),
}));

describe("POST /api/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (!fs.existsSync(mockUploadDir)) {
      fs.mkdirSync(mockUploadDir);
    }
  });

  it("should handle file upload and send file path", async () => {
    const file = new File(["dummy content"], "testfile.csv", {
      type: "text/csv",
    });
    const formData = new FormData();
    formData.append("file", file);

    const req = new Request("/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.message).toBe("File path sent successfully");
  });

  it("should return error if no file is uploaded", async () => {
    const formData = new FormData();

    const req = new Request("/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("No file uploaded");
  });
});
