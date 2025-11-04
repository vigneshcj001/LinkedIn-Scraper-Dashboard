import React, { useState } from "react";

const REACTION_TYPES = [
  { label: "👍 Like", value: "LIKE" },
  { label: "👏 Celebrate", value: "CELEBRATE" },
  { label: "❤️ Love", value: "LOVE" },
  { label: "💡 Insightful", value: "INSIGHTFUL" },
  { label: "🤔 Curious", value: "CURIOUS" },
  { label: "All", value: "ALL" },
];

const ReactionsTab = () => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/satyanadella_mayo-clinic-accelerates-personalized-medicine-activity-7285003244957773826-TrmI/"
  );
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

  const renderTable = () => {
    const reactions = data?.data?.reactions || [];
    const total = data?.data?.metadata?.total || reactions.length || 0;

    if (loading) return <p>Loading reactions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!reactions.length)
      return <p className="text-gray-500">No reactions found.</p>;

    return (
      <>
        <p className="text-sm text-gray-600 mb-2">
          Showing {reactions.length} reactions (Total: {total})
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Photo</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Headline</th>
                <th className="px-3 py-2 text-left">Reaction</th>
                <th className="px-3 py-2 text-left">Profile</th>
              </tr>
            </thead>
            <tbody>
              {reactions.map((r, i) => {
                const reactor = r.reactor || {};
                const photo =
                  reactor?.profile_pictures?.small ||
                  reactor?.profile_pictures?.medium ||
                  "";

                return (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">
                      {photo ? (
                        <img
                          src={photo}
                          alt={reactor.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {reactor.name || "-"}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      {reactor.headline || "-"}
                    </td>
                    <td className="px-3 py-2">{r.reaction_type || "-"}</td>
                    <td className="px-3 py-2">
                      {reactor.profile_url ? (
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
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">
        Get LinkedIn Post Reactions
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Enter LinkedIn Post URL"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          required
        />

        <div className="flex flex-wrap gap-2">
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

        <p className="text-gray-600 text-sm">
          Selected: <strong>{reactionType}</strong>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Fetching..." : "Get Reactions"}
        </button>
      </form>

      <div className="mt-6">{renderTable()}</div>
    </div>
  );
};

export default ReactionsTab;
