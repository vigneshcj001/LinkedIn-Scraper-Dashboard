import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const REACTION_TYPES = [
  { label: "👍 Like", value: "LIKE" },
  { label: "👏 Celebrate", value: "CELEBRATE" },
  { label: "❤️ Love", value: "LOVE" },
  { label: "💡 Insightful", value: "INSIGHTFUL" },
  { label: "🤔 Curious", value: "CURIOUS" },
  { label: "All", value: "ALL" },
];

const ReactionsTab = ({ ...props }) => {
  const [postUrl, setPostUrl] = useState("");
  const [reactionType, setReactionType] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setData(null);

    if (!postUrl.trim()) {
      alert("Please enter a LinkedIn post URL!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_url: postUrl,
          page_number: "1",
          reaction_type: reactionType,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Failed to fetch reactions");

      setData(json);
    } catch (err) {
      console.error("❌ Error fetching reactions:", err);
      setError(err.message || "Failed to fetch reactions");
    } finally {
      setLoading(false);
    }
  };

  const ReactionsDataTable = () => {
    const reactions = data?.data?.reactions || [];

    if (loading) return <p>Loading reactions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!reactions.length)
      return <p className="text-gray-500">No reactions found.</p>;

    return (
      <>
        <p className="text-sm text-gray-600 mb-2">
          Showing {reactions.length} reactions
        </p>

        <DataTable
          title="Post Reactions"
          data={reactions.map((r, index) => {
            const reactor = r.reactor || {};
            const photo =
              reactor?.profile_pictures?.small ||
              reactor?.profile_pictures?.medium ||
              "";

            return {
              "#": index + 1,
              Photo: photo ? (
                <img
                  src={photo}
                  alt={reactor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                "-"
              ),
              Name: reactor.name || "-",
              Headline: reactor.headline || "-",
              Type: r.reaction_type || "-",
              Profile: reactor.profile_url ? (
                <a
                  href={reactor.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              ) : (
                "-"
              ),
            };
          })}
          columns={["#", "Photo", "Name", "Headline", "Type", "Profile"]}
        />
      </>
    );
  };

  return (
    <TabContainer
      title="Get Post Reactions"
      onSubmit={handleSubmit}
      TableComponent={ReactionsDataTable}
      {...props}
    >
      {/* Post URL Input */}
      <input
        type="url"
        className="block w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter LinkedIn Post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        required
      />

      {/* Reaction Type Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {REACTION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setReactionType(type.value)}
            className={`px-3 py-2 rounded-md border text-sm transition ${
              reactionType === type.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm mb-2">
        Selected Reaction:{" "}
        <span className="font-medium text-gray-800">{reactionType}</span>
      </p>
    </TabContainer>
  );
};

export default ReactionsTab;
