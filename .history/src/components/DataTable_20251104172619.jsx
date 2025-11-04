import React from "react";
import { exportToJSON, exportToCSV } from "../utils/exportUtils";

const DataTable = ({ data, title }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => exportToJSON(data, `${title || "data"}.json`)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportToCSV(data, `${title || "data"}.csv`)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="border px-2 py-1 bg-gray-100 font-semibold"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j} className="border px-2 py-1">
                  {String(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
