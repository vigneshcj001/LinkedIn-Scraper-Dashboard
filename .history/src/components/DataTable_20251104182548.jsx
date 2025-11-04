import React from "react";

const DataTable = ({ data, columns, title }) => {
  if (!data || data.length === 0)
    return <p className="text-gray-600">No data available for {title}.</p>;

  const tableColumns = columns || Object.keys(data[0]);

  // --- Export Handlers ---
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvRows = [];
    csvRows.push(tableColumns.join(","));
    data.forEach((row) => {
      csvRows.push(
        tableColumns
          .map((col) => {
            const value = row[col];
            if (value && typeof value === "object" && value.$$typeof)
              return "[ReactElement]";
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
          })
          .join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-medium text-gray-700">{title}</h3>

        <div className="flex gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
          >
            Export JSON
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {tableColumns.map((col) => (
              <th key={col} className="px-6 py-3">
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
                  {row[col] && typeof row[col] === "object" && row[col].$$typeof
                    ? row[col]
                    : row[col]
                    ? String(row[col])
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
