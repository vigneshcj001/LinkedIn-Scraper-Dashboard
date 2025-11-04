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
