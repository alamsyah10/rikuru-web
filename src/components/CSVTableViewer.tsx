"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import SortingForm from "./SortingForm";
import SortButton from "./SortButton";
import { processCandidates } from "../utils/api";

// Define types for table data
interface TableRow {
  [key: string]: string | number;
}

const CSVTableViewer: React.FC = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle CSV and Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    const reader = new FileReader();

    if (fileExtension === "csv") {
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredData = result.data.map((row: any, index: number) => ({
              No: index + 1,
              ID: row["ID"],
              年齢: row["年齢"],
              誕生日: row["誕生日"],
              現在の所属: row["現在の所属"],
              日本語レベル: row["日本語レベル"],
              能力試験JLPT: row["能力試験JLPT"],
              英語レベル: row["英語レベル"],
              学校所在国: row["学校所在国"],
              学校名: row["学校名"],
              "学部・学科・専攻": row["学部・学科・専攻"],
              "研究・専門分野": row["研究・専門分野"],
            }));
            setHeaders(Object.keys(filteredData[0]));
            setTableData(filteredData);
            setCurrentPage(1);
          },
          error: (error: any) => console.error("Error parsing CSV: ", error),
        });
      };
      reader.readAsText(file, "UTF-8");
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      reader.onload = (event) => {
        const binaryData = event.target?.result as string;
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const filteredData = jsonData
          .filter(row => 
              row['年齢'] && 
              row['現在の所属'] && 
              row['日本語レベル'] && 
              row['能力試験JLPT'] && 
              row['学校名']
          )
          .map((row, index) => ({
              No: index + 1,
              ID: row['ID'],
              年齢: row['年齢'],
              誕生日: row['誕生日'],
              現在の所属: row['現在の所属'],
              日本語レベル: row['日本語レベル'],
              能力試験JLPT: row['能力試験JLPT'],
              英語レベル: row['英語レベル'],
              学校所在国: row['学校所在国'],
              学校名: row['学校名'],
              "学部・学科・専攻": row['学部・学科・専攻'],
              "研究・専門分野": row['研究・専門分野']
          }));

        setHeaders(Object.keys(filteredData[0]));
        setTableData(filteredData);
        setCurrentPage(1);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  const sortData = async (priorities: string[]) => {
    const data = tableData.map((obj) => ({
      no: obj["No"],
      id: obj["ID"],
      age: obj["年齢"],
      birthday: obj["誕生日"],
      currentAffiliation: obj["現在の所属"],
      japaneseLevel: obj["日本語レベル"],
      jlpt: obj["能力試験JLPT"],
      englishLevel: obj["英語レベル"],
      schoolLocation: obj["学校所在国"],
      schoolName: obj["学校名"],
      faculty: obj["学部・学科・専攻"] || "N/A",
      specialization: obj["研究・専門分野"] || "N/A",
    }));

    const sortedData = await processCandidates({
      candidates: data,
      priorities: priorities,
    });

    const newData = sortedData.candidates.map((obj: any) => ({
      No: obj["no"],
      ID: obj["id"],
      年齢: obj["age"],
      誕生日: obj["birthday"],
      現在の所属: obj["currentAffiliation"],
      日本語レベル: obj["japaneseLevel"],
      能力試験JLPT: obj["jlpt"],
      英語レベル: obj["englishLevel"],
      学校所在国: obj["schoolLocation"],
      学校名: obj["schoolName"],
      "学部・学科・専攻": obj["faculty"],
      "研究・専門分野": obj["specialization"],
    }));

    setTableData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">応募者ランキング</h1>

      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {tableData.length > 0 ? (
        <div className="overflow-auto max-w-6xl w-full">
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 bg-gray-200 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-white even:bg-gray-50">
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Upload a CSV or Excel file to see data.</p>
      )}
      <SortButton onSort={sortData} />
    </div>
  );
};

export default CSVTableViewer;
