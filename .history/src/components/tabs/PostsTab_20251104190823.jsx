import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const PostsTab = ({ fetchData, ...props }) => {
  const [username, setUsername] = useState("ganapathy-subburathinam");
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("posts", { username, page_number: pageNumber });
  };

  const PostsDataTable = ({ data }) => {
    const posts = data?.data?.posts || data?.posts || [];
    if (!posts.length) return <p>No posts found.</p>;

    // ✅ Export Functions
    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(posts, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_posts.json`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const exportCSV = () => {
      const csvHeaders = [
        "Author",
        "Headline",
        "Text",
        "Reactions",
        "Comments",
        "Reposts",
        "Posted",
        "Link",
      ];
      const csvRows = posts.map((p) => [
        `"${`${p.author?.first_name || ""} ${p.author?.last_name || ""}`}"`,
        `"${p.author?.headline || "-"}"`,
        `"${(p.text || "").replace(/"/g, '""')}"`,
        `"${p.stats?.total_reactions || 0}"`,
        `"${p.stats?.comments || 0}"`,
        `"${p.stats?.reposts || 0}"`,
        `"${p.posted_at?.relative || "-"}"`,
        `"${p.url || "-"}"`,
      ]);

      const csvContent =
        csvHeaders.join(",") +
        "\n" +
        csvRows.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_posts.csv`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div>
        {/* ✅ Export Buttons */}
        <div className="flex justify-end space-x-4 mb-4">
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

        {/* ✅ Posts Table */}
        <DataTable
          title="📰 Profile Posts"
          data={posts.map((p) => ({
            Author: `${p.author?.first_name || ""} ${
              p.author?.last_name || ""
            }`,
            Headline: p.author?.headline || "-",
            Text: p.text ? `${p.text.slice(0, 80)}...` : "-",
            Reactions: p.stats?.total_reactions || 0,
            Comments: p.stats?.comments || 0,
            Reposts: p.stats?.reposts || 0,
            Posted: p.posted_at?.relative || "-",
            Link: p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Post
              </a>
            ) : (
              "-"
            ),
          }))}
          columns={[
            "Author",
            "Headline",
            "Text",
            "Reactions",
            "Comments",
            "Reposts",
            "Posted",
            "Link",
          ]}
        />
      </div>
    );
  };

  return (
    <TabContainer
      title="Get Profile Posts"
      onSubmit={handleSubmit}
      TableComponent={PostsDataTable}
      {...props}
    >
      <input
        type="text"
        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter LinkedIn username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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

export default PostsTab;
