import React from "react";

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data available.</p>;
  }

  const keys = Object.keys(data[0]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvRows = [];
    const headers = keys.join(",");
    csvRows.push(headers);
    data.forEach((row) => {
      const values = keys.map(
        (k) => `"${String(row[k] ?? "").replace(/"/g, '""')}"`
      );
      csvRows.push(values.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6">
      {/* Export Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={exportJSON}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export JSON
        </button>
        <button
          onClick={exportCSV}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((key) => (
                <th key={key} className="px-4 py-2 font-semibold">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {keys.map((key) => (
                  <td key={key} className="px-4 py-2 border-t">
                    {String(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
