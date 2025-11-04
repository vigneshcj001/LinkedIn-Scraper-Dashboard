import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const CommentsTab = ({ fetchData, ...props }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/chorouk-malmoum_ive-built-90-ai-agents-in-last-12-months-activity-7371091659725635584-8zS1"
  );
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("comments", { post_url: postUrl, page_number: pageNumber });
  };

  // ---------- Export JSON ----------
  const exportJSON = (data, filename = "comments_data.json") => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Export CSV ----------
  const exportCSV = (data, filename = "comments_data.csv") => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Table ----------
  const CommentsDataTable = ({ data }) => {
    const comments = data?.data?.comments || data?.comments || [];
    if (!comments.length) return <p>No comments found.</p>;

    // Prepare simplified data for DataTable
    const tableData = comments.map((c) => ({
      Commenter: c.author?.name || "-",
      Headline: c.author?.headline || "-",
      Text: c.text ? `${c.text.slice(0, 80)}...` : "-",
      Reactions: c.stats?.total_reactions || 0,
      Posted: c.posted_at?.relative || "-",
      Link: c.comment_url ? (
        <a
          href={c.comment_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Comment
        </a>
      ) : (
        "-"
      ),
    }));

    return (
      <div className="space-y-6">
        {/* ✅ Table */}
        <DataTable
          title="Post Comments"
          data={tableData}
          columns={[
            "Commenter",
            "Headline",
            "Text",
            "Reactions",
            "Posted",
            "Link",
          ]}
        />

        {/* ✅ Export Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => exportJSON(comments)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium shadow-sm transition"
          >
            Export JSON
          </button>
          <button
            onClick={() =>
              exportCSV(
                comments.map((c) => ({
                  Commenter: c.author?.name || "-",
                  Headline: c.author?.headline || "-",
                  Text: c.text || "-",
                  Reactions: c.stats?.total_reactions || 0,
                  Posted: c.posted_at?.relative || "-",
                  CommentURL: c.comment_url || "-",
                }))
              )
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition"
          >
            Export CSV
          </button>
        </div>
      </div>
    );
  };

  return (
    <TabContainer
      title="Get Post Comments"
      onSubmit={handleSubmit}
      TableComponent={CommentsDataTable}
      {...props}
    >
      <input
        type="url"
        className="block w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter LinkedIn Post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        required
      />
      <input
        type="number"
        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Page Number"
        value={pageNumber}
        onChange={(e) => setPageNumber(e.target.value)}
        min="1"
      />
    </TabContainer>
  );
};

export default CommentsTab;
