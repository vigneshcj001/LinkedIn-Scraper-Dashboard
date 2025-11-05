import React, { useState } from "react";
import toast from "react-hot-toast";
import TabContainer from "../TabContainer";

const BulkCommentAnalyticsUploadTab = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a CSV file first!");
    const apiKey = localStorage.getItem("rapidApiKey");
    if (!apiKey) return toast.error("Please enter your RapidAPI Key first.");

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "/upload/comment-analytics",
        {
          method: "POST",
          headers: { "x-rapidapi-key": apiKey },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to upload CSV.");
      }

      const data = await res.json();
      setUploadResult(data);
      toast.success(`✅ Processed ${data.count} post URLs for analytics.`);
    } catch (err) {
      toast.error(err.message);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const exportJSON = () => {
    if (!uploadResult) return toast.error("No data to export.");
    const blob = new Blob([JSON.stringify(uploadResult.results, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "linkedin_bulk_comment_analytics.json";
    link.click();
  };

  const exportCSV = () => {
    if (!uploadResult) return toast.error("No data to export.");

    const csvSections = [];

    uploadResult.results.forEach((item, index) => {
      csvSections.push(`Post ${index + 1}: ${item.post_url}`);
      if (item.error) {
        csvSections.push("Key,Value");
        csvSections.push(`Error,"${item.error}"`);
        csvSections.push("");
        return;
      }

      const summary = item.summary || {};
      if (!summary.total_comments) {
        csvSections.push("No comments or analytics found for this post.");
        csvSections.push("");
        return;
      }

      csvSections.push("Metric,Value");
      Object.entries(summary).forEach(([key, value]) => {
        if (key === "top_commenters") {
          csvSections.push(
            `"Top Commenters","${value
              .map(([name, count]) => `${name} (${count})`)
              .join("; ")}"`
          );
        } else {
          csvSections.push(
            `"${key.replace(/_/g, " ")}","${
              typeof value === "number"
                ? value.toLocaleString(undefined, { maximumFractionDigits: 3 })
                : String(value)
            }"`
          );
        }
      });
      csvSections.push("");
      csvSections.push("");
    });

    const blob = new Blob([csvSections.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "linkedin_bulk_comment_analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TabContainer
      title="📤 Bulk Upload LinkedIn Post URLs for Comment Analytics (CSV)"
      onSubmit={handleFileUpload}
    >
      <div className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload a CSV file containing LinkedIn post URLs (must have a
            'post_url' column):
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`px-6 py-3 rounded-md text-white transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>

        {uploadResult && (
          <div className="flex flex-col items-start mt-6 space-y-3">
            <p className="text-gray-700">
              ✅ Processed {uploadResult.count} post URLs.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={exportJSON}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Export JSON
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Export CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </TabContainer>
  );
};

export default BulkCommentAnalyticsUploadTab;
