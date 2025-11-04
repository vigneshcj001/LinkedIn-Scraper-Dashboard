// src/utils/exportUtils.js

export const exportToJSON = (data, filename = "data.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToCSV = (data, filename = "data.csv") => {
  if (!data || data.length === 0) return;

  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(","), // header row
    ...data.map((row) =>
      keys.map((key) => JSON.stringify(row[key] ?? "")).join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
