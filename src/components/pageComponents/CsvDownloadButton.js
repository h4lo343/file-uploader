import { CSVLink, CSVDownload } from "react-csv";

export const CsvDownloadButton = ({ failedData }) => {
  const csvData = [];
  csvData.push(Object.keys(failedData[0]));
  for (let d of failedData) {
    csvData.push(Object.values(d));
  }
  return (
    <CSVLink data={csvData} className="underline text-blue-500 cursor-pointer">
      Download failed contacts.csv
    </CSVLink>
  );
};
