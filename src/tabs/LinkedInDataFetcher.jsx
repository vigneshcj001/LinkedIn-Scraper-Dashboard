import React, { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000"; // Backend FastAPI URL

const LinkedInDataFetcher = () => {
  const [companyName, setCompanyName] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [commentsData, setCommentsData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState("");
  const [showCompanyJson, setShowCompanyJson] = useState(false);
  const [showCommentsJson, setShowCommentsJson] = useState(false);

  // Fetch Company Details
  const fetchCompany = async () => {
    if (!companyName.trim()) return alert("Enter a company name!");
    setLoadingCompany(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/company/${companyName}`);
      if (!res.ok) throw new Error("Failed to fetch company data.");
      const data = await res.json();
      setCompanyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCompany(false);
    }
  };

  // Fetch Post Comments
  const fetchComments = async () => {
    if (!postUrl.trim()) return alert("Enter a LinkedIn post URL!");
    setLoadingComments(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl }),
      });
      if (!res.ok) throw new Error("Failed to fetch comments data.");
      const data = await res.json();
      setCommentsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 flex flex-col gap-10">
      <motion.h1
        className="text-4xl font-bold text-center text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        LinkedIn Intelligence Dashboard
      </motion.h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ===== COMPANY DETAILS ===== */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🏢 Company Details
        </h2>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter company name (e.g., YouTube)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2"
          />
          <button
            onClick={fetchCompany}
            disabled={loadingCompany}
            className={`${
              loadingCompany ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded transition`}
          >
            {loadingCompany ? "Fetching..." : "Fetch Data"}
          </button>
        </div>

        {companyData && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-2 text-left">Key</th>
                  <th className="p-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Company Name", companyData?.data?.basic_info?.name],
                  [
                    "Tagline",
                    companyData?.data?.basic_info?.description?.slice(0, 100) +
                      "...",
                  ],
                  [
                    "LinkedIn URL",
                    <a
                      href={companyData?.data?.basic_info?.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>,
                  ],
                  [
                    "Website",
                    companyData?.data?.basic_info?.website || "Not Available",
                  ],
                  [
                    "Industry",
                    companyData?.data?.basic_info?.industries?.join(", ") ||
                      "N/A",
                  ],
                  [
                    "Company Type",
                    companyData?.data?.basic_info?.page_type || "N/A",
                  ],
                  [
                    "Headquarters",
                    companyData?.data?.locations?.headquarters?.city +
                      ", " +
                      companyData?.data?.locations?.headquarters?.country,
                  ],
                  [
                    "Followers",
                    companyData?.data?.stats?.follower_count || "N/A",
                  ],
                  [
                    "Employees",
                    companyData?.data?.stats?.employee_count || "N/A",
                  ],
                ].map(([key, val]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="p-2 border font-medium text-gray-700">
                      {key}
                    </td>
                    <td className="p-2 border">{val || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-4 text-sm text-blue-600 underline"
              onClick={() => setShowCompanyJson(!showCompanyJson)}
            >
              {showCompanyJson ? "Hide" : "Show"} Raw JSON Response
            </button>

            {showCompanyJson && (
              <pre className="mt-3 bg-gray-900 text-green-300 p-3 rounded overflow-x-auto text-xs">
                {JSON.stringify(companyData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </motion.div>

      {/* ===== POST COMMENTS ===== */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          💬 Post Comments
        </h2>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter LinkedIn Post URL"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2"
          />
          <button
            onClick={fetchComments}
            disabled={loadingComments}
            className={`${
              loadingComments
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-6 py-2 rounded transition`}
          >
            {loadingComments ? "Fetching..." : "Fetch Comments"}
          </button>
        </div>

        {commentsData && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-2 text-left">Commenter</th>
                  <th className="p-2 text-left">Headline</th>
                  <th className="p-2 text-left">Comment</th>
                  <th className="p-2 text-left">Reactions</th>
                  <th className="p-2 text-left">Posted</th>
                </tr>
              </thead>
              <tbody>
                {commentsData?.data?.comments?.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{c.commenter?.name || "N/A"}</td>
                    <td className="p-2 border">
                      {c.commenter?.subtitle || "N/A"}
                    </td>
                    <td className="p-2 border">
                      {c.comment_text
                        ? c.comment_text.slice(0, 120) + "..."
                        : "N/A"}
                    </td>
                    <td className="p-2 border">
                      {c.stats?.total_reactions || 0}
                    </td>
                    <td className="p-2 border">
                      {c.created_at?.relative || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-4 text-sm text-blue-600 underline"
              onClick={() => setShowCommentsJson(!showCommentsJson)}
            >
              {showCommentsJson ? "Hide" : "Show"} Raw JSON Response
            </button>

            {showCommentsJson && (
              <pre className="mt-3 bg-gray-900 text-green-300 p-3 rounded overflow-x-auto text-xs">
                {JSON.stringify(commentsData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LinkedInDataFetcher;
