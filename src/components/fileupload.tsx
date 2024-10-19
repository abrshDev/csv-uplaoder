import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ToastAction } from "@radix-ui/react-toast";
import { UploadIcon } from "@radix-ui/react-icons";

interface CsvUploadProps {
  onFileUpload: (file: File, email: string, storeName: string) => void;
  btnText: string;
  isLoading: boolean;
}

const CsvUpload: React.FC<CsvUploadProps> = ({
  onFileUpload,
  btnText,
  isLoading,
}) => {
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");

  // Validation error states
  const [fileError, setFileError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [storeNameError, setStoreNameError] = useState<string | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setFileError(null); // Clear file error if valid
    } else {
      setFileError("Please upload a valid CSV file");
      toast({
        variant: "destructive",
        title: "The file you're trying to upload is not supported!",
        description: "Try uploading a CSV file",
        action: <ToastAction altText="Cancel">Cancel</ToastAction>,
      });
    }
  };

  const handleUploadClick = () => {
    let isValid = true;

    if (!selectedFile) {
      setFileError("File is required");
      isValid = false;
    } else {
      setFileError(null);
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!storeName) {
      setStoreNameError("Store name is required");
      isValid = false;
    } else {
      setStoreNameError(null);
    }

    if (isValid && selectedFile && email && storeName) {
      onFileUpload(selectedFile, email, storeName);
    } else {
      toast({
        variant: "destructive",
        title: "Please complete all fields!",
        description: "You need to fill all fields correctly",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <div className="bg-blue-100 dark:bg-gray-600 rounded-xl">
      <div className="flex p-6 flex-col items-center justify-center gap-4">
        <div className="w-full">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className=" py-2 h-9.5 text-slate-900 dark:text-black bg-white"
          />
          {fileError && <p className="text-red-500 text-xs flex ml-1 mt-1">{fileError}</p>}
        </div>

        <div className="w-full">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white py-2 h-9.5 text-slate-900 dark:placeholder:text-black placeholder:text-x"
            placeholder="Enter your email to receive the final file..."
            list=""
          />
          {emailError && <p className="text-red-500 text-xs flex ml-1 mt-1">{emailError}</p>}
        </div>

        <div className="w-full">
          <Input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="bg-white py-2 h-9.5 text-slate-900 placeholder:text-sm dark:placeholder:text-black"
            placeholder="Enter the store name you are looking for..."
          />
          {storeNameError && <p className="text-red-500 text-xs flex ml-1 mt-1">{storeNameError}</p>}
        </div>

        <Button
          onClick={handleUploadClick}
          className="bg-blue-500 dark:bg-blue-800 hover:bg-blue-600 w-full text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <UploadIcon />
            <p>{btnText}</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CsvUpload;
