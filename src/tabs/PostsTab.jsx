import React, { useState } from "react";


const PostsTab = ({ fetchData, ...props }) => {
  const [username, setUsername] = useState("neal-mohan");
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("posts", { username, page_number: pageNumber });
  };

  const PostsDataTable = ({ data }) => {
    const posts = data?.data?.posts || [];
    return (
      <DataTable
        title="Profile Posts"
        data={posts.map((post) => ({
          Author:
            post.author?.first_name + " " + post.author?.last_name || "N/A",
          Headline: post.author?.headline || "N/A",
          Text: post.text ? `${post.text.substring(0, 100)}...` : "N/A", // Truncate long text
          Reactions: post.stats?.total_reactions || 0,
          Comments: post.stats?.comments || 0,
          Reposts: post.stats?.reposts || 0,
          Posted: post.posted_at?.relative || "N/A",
          Link: post.url ? (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
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
        placeholder="Enter LinkedIn username (e.g., neal-mohan)"
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