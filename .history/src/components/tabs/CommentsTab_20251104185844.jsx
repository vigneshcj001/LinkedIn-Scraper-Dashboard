import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const CommentsTab = ({ fetchData, ...props }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/chorouk-malmoum_ive-built-90-ai-agents-in-last-12-months-activity-7371091659725635584-8zS1"
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [commentsData, setCommentsData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetchData("comments", {
      post_url: postUrl,
      page_number: pageNumber,
    });
    setCommentsData(result?.data?.comments || result?.comments || []);
  };

  // ---------- Export as JSON ----------
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(commentsData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "linkedin_comments.json";
    link.click();
  };

  // ---------- Export as CSV ----------
  const exportAsCSV = () => {
    if (!commentsData.length) return;
    const headers = [
      "Commenter",
      "Headline",
      "Text",
      "Reactions",
      "Posted",
      "Link",
    ];
    const rows = commentsData.map((c) => [
      c.author?.name || "-",
      c.author?.headline || "-",
      c.text ? c.text.replace(/[\n\r]+/g, " ").slice(0, 80) : "-",
      c.stats?.total_reactions || 0,
      c.posted_at?.relative || "-",
      c.comment_url || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "linkedin_comments.csv";
    link.click();
  };

  const CommentsDataTable = ({ data }) => {
    const comments = commentsData || [];
    if (!comments.length) return <p>No comments found.</p>;

    return (
      <div>
        <div className="flex justify-end mb-3 space-x-2">
          <button
            onClick={exportAsJSON}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export JSON
          </button>
          <button
            onClick={exportAsCSV}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>

        <DataTable
          title="Post Comments"
          data={comments.map((c) => ({
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
          }))}
          columns={[
            "Commenter",
            "Headline",
            "Text",
            "Reactions",
            "Posted",
            "Link",
          ]}
        />
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
        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
