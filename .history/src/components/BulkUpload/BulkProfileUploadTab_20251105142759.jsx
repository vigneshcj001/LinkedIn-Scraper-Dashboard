import React, { useState } from "react";
import toast from "react-hot-toast";
import TabContainer from "../TabContainer";

const BulkProfileUploadTab = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // ✅ Handle CSV Upload
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

      const res = await fetch("http://127.0.0.1:8000/api/upload/profiles", {
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
      toast.success(`✅ Processed ${data.count} usernames.`);
    } catch (err) {
      toast.error(err.message);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Export JSON (all results)
  const exportJSON = () => {
    if (!uploadResult) return toast.error("No data to export.");
    const blob = new Blob([JSON.stringify(uploadResult.results, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "linkedin_bulk_profiles.json";
    link.click();
  };

  // ✅ Export CSV — identical layout to ProfileTab export
  // ✅ Export CSV — identical layout to ProfileTab export
  const exportCSV = () => {
    if (!uploadResult) return toast.error("No data to export.");

    const csvSections = [];

    uploadResult.results.forEach((item, index) => {
      if (item.error) {
        csvSections.push(`Profile ${index + 1}: ${item.username}`);
        csvSections.push("Key,Value");
        csvSections.push(`Error,"${item.error}"`);
        csvSections.push("");
        return;
      }

      const data = item.data;
      if (!data?.basic_info) return;

      const profile = data.basic_info;
      const experience = data.experience || [];
      const education = data.education || [];

      // Add profile header
      csvSections.push(`Profile ${index + 1}: ${item.username}`);
      csvSections.push("");

      // --- Basic Info ---
      csvSections.push("Basic Info");
      csvSections.push("Key,Value");

      const basicInfo = [
        ["Full Name", profile.fullname],
        ["Headline", profile.headline],
        ["Profile URL", profile.profile_url],
        ["Location", profile.location?.full || "-"],
        ["Followers", profile.follower_count],
        ["Connections", profile.connection_count],
        ["Current Company", profile.current_company],
      ];

      csvSections.push(...basicInfo.map((r) => `"${r[0]}","${r[1] || "-"}"`));
      csvSections.push("");

      // --- Experience ---
      if (experience.length) {
        csvSections.push("Experience");
        csvSections.push("Title,Company,Duration,Company URL");
        csvSections.push(
          ...experience.map(
            (exp) =>
              `"${exp.title || "-"}","${exp.company || "-"}","${
                exp.duration || "-"
              }","${exp.company_linkedin_url || "-"}"`
          )
        );
        csvSections.push("");
      }

      // --- Education ---
      if (education.length) {
        csvSections.push("Education");
        csvSections.push("School,Degree,Field,Duration,School URL");
        csvSections.push(
          ...education.map(
            (edu) =>
              `"${edu.school || "-"}","${edu.degree_name || "-"}","${
                edu.field_of_study || "-"
              }","${edu.duration || "-"}","${edu.school_linkedin_url || "-"}"`
          )
        );
      }

      // Separator between profiles
      csvSections.push("");
      csvSections.push("");
    });

    const blob = new Blob([csvSections.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "linkedin_bulk_profiles.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TabContainer
      title="📤 Bulk Upload LinkedIn Usernames (CSV)"
      onSubmit={handleFileUpload}
    >
      <div className="space-y-5">
        {/* CSV Upload Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload a CSV file containing LinkedIn usernames:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Upload Button */}
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

        {/* Export Buttons */}
        {uploadResult && (
          <div className="flex flex-col items-start mt-6 space-y-3">
            <p className="text-gray-700">
              ✅ {uploadResult.count} profiles processed successfully.
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

export default BulkProfileUploadTab;
