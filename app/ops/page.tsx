"use client";

import { useState } from "react";

export default function OpsPage() {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [range, setRange] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch(
      `/api/spreadsheet?spreadsheetId=${spreadsheetId}&range=${range}`
    );
    const result = await response.json();
    setData(result);
  };

  const insertData = async () => {
    const values = [
      ["New", "Data", "To", "Insert"],
      [1, 2, 3, 4],
    ];
    const response = await fetch("/api/spreadsheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spreadsheetId, range, values }),
    });
    const result = await response.json();
    console.log("Inserted:", result);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Spreadsheet Operations</h1>
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Spreadsheet ID"
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Range (e.g. Sheet1!A1:D5)"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Fetch Data
        </button>
        <button
          onClick={insertData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
        >
          Insert Data
        </button>
      </div>
      {data && (
        <pre className="mt-6 w-full max-w-md p-4 bg-white border border-gray-300 rounded overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
