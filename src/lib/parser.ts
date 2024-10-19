import Papa from "papaparse";
import fs from "fs";
import path from "path";

export const Parser = (filePath: string): any => {
  // Read and parse the CSV file
  const csvData = fs.readFileSync(filePath, "utf-8");
  const parsedData: any = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  }).data;
  return parsedData;
};

export const saveData = (data: CSVData[]) => {
    const folderPath = path.join(process.cwd(), "final_data");
    const prefix = 'final_data'
    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    const finalData = Papa.unparse(data)

  // Generate a dynamic file name using a timestamp and prefix
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const fileName = `${prefix}_${timestamp}.csv`;
  const filePath = path.join(folderPath, fileName);

  // Write the data to the file (JSON string format)
  fs.writeFileSync(filePath, finalData);
};
