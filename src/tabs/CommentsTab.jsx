import React, { useState } from "react";

const CommentsTab = ({ fetchData }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/satyanadella_were-taking-the-next-big-step-with-researcher-ugcPost-7389713443714469888-B-oo"
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [sortOrder, setSortOrder] = useState("Most relevant");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("comments", {
      post_url: postUrl,
      page_number: pageNumber,
      sort_order: sortOrder,
    });
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-3">Fetch LinkedIn Comments</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Post URL:</label>
          <input
            type="text"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Enter LinkedIn Post URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Page Number:</label>
          <input
            type="number"
            min="1"
            value={pageNumber}
            onChange={(e) => setPageNumber(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option>Most relevant</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Fetch Comments
        </button>
      </form>
    </div>
  );
};

export default CommentsTab;
