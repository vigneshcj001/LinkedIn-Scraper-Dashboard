import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const CommentsTab = ({ fetchData, ...props }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/chorouk-malmoum_ive-built-90-ai-agents-in-last-12-months-activity-7371091659725635584-8zS1?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC0AjAEB13qzcyb0uxtDOeMXhJ9kXGeFc6A"
  );
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("comments", { post_url: postUrl, page_number: pageNumber });
  };

  const CommentsDataTable = ({ data }) => {
    const comments = data?.data?.comments || data?.comments || [];
    if (!comments.length) return <p>No comments found.</p>;

    return (
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
