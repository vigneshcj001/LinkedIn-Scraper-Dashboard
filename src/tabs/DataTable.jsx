import React from "react";
// --- Reusable Data Table Component ---
const DataTable = ({ data, columns, title }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-600">No data available for {title}.</p>;
  }

  const tableColumns = columns || Object.keys(data[0]);

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6">
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {tableColumns.map((col) => (
              <th key={col} scope="col" className="px-6 py-3">
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {tableColumns.map((col) => (
                <td key={col} className="px-6 py-4">
                  {/* ✅ Render React elements directly */}
                  {React.isValidElement(row[col])
                    ? row[col]
                    : row[col] !== null &&
                      row[col] !== undefined &&
                      row[col] !== ""
                    ? row[col]
                    : "-"}
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