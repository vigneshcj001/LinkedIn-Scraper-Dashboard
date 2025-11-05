import React, { useState } from "react";
import toast from "react-hot-toast";
import TabContainer from "../TabContainer";

const BulkCompaniesUploadTab = () => {
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

      const res = await fetch("/upload/companies", {
        method: "POST",
        headers: { "x-rapidapi-key": apiKey },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to upload CSV.");
      }

      const data = await res.json();
      setUploadResult(data);
      toast.success(`✅ Processed ${data.count} company identifiers.`);
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
    link.download = "linkedin_bulk_companies.json";
    link.click();
  };

  const exportCSV = () => {
    if (!uploadResult) return toast.error("No data to export.");

    const csvSections = [];

    uploadResult.results.forEach((item, index) => {
      csvSections.push(`Company ${index + 1}: ${item.identifier}`);
      if (item.error) {
        csvSections.push("Key,Value");
        csvSections.push(`Error,"${item.error}"`);
        csvSections.push("");
        return;
      }

      const data = item.data;
      if (!data?.basic_info) return;

      const company = data.basic_info;
      const stats = data.stats || {};
      const locations = data.locations || {};
      const funding = data.funding || {};
      const links = data.links || {};

      csvSections.push("");

      // --- Basic Info ---
      csvSections.push("Basic Info");
      csvSections.push("Key,Value");
      const basicInfoRows = [
        ["Name", company.name],
        ["Tagline", company.description],
        ["LinkedIn URL", company.linkedin_url],
        ["Website", company.website],
        ["Industry", (company.industries || []).join(", ")],
        ["Specialties", (company.specialties || []).join(", ")],
        ["Founded", company.founded_info?.year],
        ["Verified", company.is_verified ? "Yes" : "No"],
      ];
      csvSections.push(
        ...basicInfoRows.map((r) => `"${r[0]}","${r[1] || "-"}"`)
      );
      csvSections.push("");

      // --- Stats ---
      csvSections.push("Stats");
      csvSections.push("Key,Value");
      const statsRows = [
        ["Followers", stats.follower_count],
        ["Employees", stats.employee_count],
        [
          "Employee Range",
          stats.employee_count_range
            ? `${stats.employee_count_range.start} - ${stats.employee_count_range.end}`
            : "-",
        ],
        ["Students", stats.student_count],
      ];
      csvSections.push(...statsRows.map((r) => `"${r[0]}","${r[1] || "-"}"`));
      csvSections.push("");

      // --- Location ---
      csvSections.push("Headquarters");
      csvSections.push("Key,Value");
      const hq = locations.headquarters || {};
      const locationRows = [
        ["Country", hq.country],
        ["State", hq.state],
        ["City", hq.city],
        ["Postal Code", hq.postal_code],
        ["Address", `${hq.line1 || ""} ${hq.line2 || ""}`],
        ["Description", hq.description],
        [
          "Coordinates",
          locations.geo_coordinates
            ? `${locations.geo_coordinates.latitude}, ${locations.geo_coordinates.longitude}`
            : "-",
        ],
      ];
      csvSections.push(
        ...locationRows.map((r) => `"${r[0]}","${r[1] || "-"}"`)
      );
      csvSections.push("");

      // --- Funding ---
      csvSections.push("Funding Information");
      csvSections.push("Key,Value");
      const fundingRows = [
        ["Total Rounds", funding.total_rounds],
        ["Latest Round Type", funding.latest_round?.type],
        ["Latest Round Date", funding.latest_round?.date],
        ["Investors", funding.latest_round?.investors_count],
        ["Crunchbase URL", funding.crunchbase_url],
      ];
      csvSections.push(...fundingRows.map((r) => `"${r[0]}","${r[1] || "-"}"`));
      csvSections.push("");

      // --- Links ---
      csvSections.push("Links");
      csvSections.push("Key,Value");
      Object.entries(links).forEach(([key, val]) => {
        csvSections.push(
          `"${key.charAt(0).toUpperCase() + key.slice(1)}","${val || "-"}"`
        );
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
    link.download = "linkedin_bulk_companies.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TabContainer
      title="📤 Bulk Upload LinkedIn Company Identifiers (CSV)"
      onSubmit={handleFileUpload}
    >
      <div className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload a CSV file containing LinkedIn company identifiers (must have
            an 'identifier' column):
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
              ✅ Processed {uploadResult.count} company identifiers.
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

export default BulkCompaniesUploadTab;
