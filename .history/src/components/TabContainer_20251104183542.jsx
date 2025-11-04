import React from "react";

const TabContainer = ({
  title,
  children,
  onSubmit,
  loading,
  error,
  response,
  TableComponent,
}) => {
  // --- Export handlers ---
  const handleExportJSON = () => {
    if (!response || !response.data) return;
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!response || !response.data) return;
    const data = response.data;
    if (!Array.isArray(data) || data.length === 0) return;

    const columns = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(columns.join(","));
    data.forEach((row) => {
      csvRows.push(
        columns
          .map((col) => {
            const value = row[col];
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
          })
          .join(",")
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

      <form onSubmit={onSubmit} className="space-y-4 mb-6">
        {children}
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </form>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {response && (
        <>
          {/* Render Table if provided */}
          {TableComponent && <TableComponent data={response.data} />}

          {/* Raw JSON + Export Buttons */}
          <div className="bg-gray-50 p-4 rounded-md shadow-inner mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium text-gray-700">
                Raw JSON Response (data only):
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                >
                  Export JSON
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap break-all text-xs bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default TabContainer;
