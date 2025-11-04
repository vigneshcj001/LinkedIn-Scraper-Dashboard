import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const PostsTab = ({ fetchData, ...props }) => {
  const [username, setUsername] = useState("ganapathy-subburathinam");
  const [pageNumber, setPageNumber] = useState(1);
  const [postsData, setPostsData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetchData("posts", {
      username,
      page_number: pageNumber,
    });
    const posts = result?.data?.posts || result?.posts || [];
    setPostsData(posts);
  };

  // -------------------------------
  // EXPORT FUNCTIONS
  // -------------------------------
  const exportJSON = () => {
    const jsonString = JSON.stringify(postsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username}_posts.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!postsData.length) return;

    const headers = [
      "Author",
      "Headline",
      "Text",
      "Reactions",
      "Comments",
      "Reposts",
      "Posted",
      "Link",
    ];

    const rows = postsData.map((p) => [
      `${p.author?.first_name || ""} ${p.author?.last_name || ""}`.trim(),
      p.author?.headline || "-",
      (p.text || "-").replace(/\n/g, " ").slice(0, 80),
      p.stats?.total_reactions || 0,
      p.stats?.comments || 0,
      p.stats?.reposts || 0,
      p.posted_at?.relative || "-",
      p.url || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username}_posts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------
  // TABLE COMPONENT
  // -------------------------------
  const PostsDataTable = ({ data }) => {
    const posts = data?.data?.posts || data?.posts || [];
    if (!posts.length) return <p>No posts found.</p>;

    return (
      <DataTable
        title="Profile Posts"
        data={posts.map((p) => ({
          Author: `${p.author?.first_name || ""} ${p.author?.last_name || ""}`,
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
    );
  };

  return (
    <TabContainer
      title="Get Profile Posts"
      onSubmit={handleSubmit}
      TableComponent={PostsDataTable}
      data={{ posts: postsData }}
      {...props}
    >
      {/* INPUTS */}
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

      {/* EXPORT BUTTONS */}
      {postsData.length > 0 && (
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={exportJSON}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      )}
    </TabContainer>
  );
};

export default PostsTab;
