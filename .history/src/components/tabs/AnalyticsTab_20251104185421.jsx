import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Label,
} from "recharts";

const AnalyticsTab = ({ fetchData, ...props }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/chorouk-malmoum_ive-built-90-ai-agents-in-last-12-months-activity-7371091659725635584-8zS1?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC0AjAEB13qzcyb0uxtDOeMXhJ9kXGeFc6A"
  );

  // Handle form submit to fetch analytics data
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("analytics/comments", { post_url: postUrl });
  };

  // Inner table + chart display component
  const AnalyticsTable = ({ data }) => {
    const summary = data?.summary || {};
    const comments = data?.comments || [];

    if (!summary.total_comments) return <p>No analytics available.</p>;

    // --- Extract top commenters ---
    const topCommenters = summary.top_commenters || [];

    // --- Reaction histogram data ---
    const reactionHistogram = summary.reaction_histogram || {};
    const reactionData = Object.entries(reactionHistogram).map(
      ([type, count]) => ({
        Reaction: type, // X-axis → number of reactions
        Count: count, // Y-axis → number of comments
      })
    );

    // --- Filtered summary metrics ---
    const filteredSummary = Object.entries(summary)
      .filter(
        ([key]) => key !== "top_commenters" && key !== "reaction_histogram"
      )
      .map(([k, v]) => ({
        Metric: k.replace(/_/g, " "),
        Value:
          typeof v === "number"
            ? v.toLocaleString(undefined, { maximumFractionDigits: 3 })
            : String(v),
      }));

    return (
      <div className="space-y-8">
        {/* ✅ Summary Table */}
        <DataTable
          title="Comment Analytics Summary"
          data={filteredSummary}
          columns={["Metric", "Value"]}
        />

        {/* ✅ Top Commenters */}
        {topCommenters.length > 0 && (
          <DataTable
            title="Top Commenters"
            data={topCommenters.map(([name, count]) => ({
              Name: name,
              Comments: count,
            }))}
            columns={["Name", "Comments"]}
          />
        )}

        {/* ✅ Reaction Histogram Chart */}
        {reactionData.length > 0 && (
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Reaction Histogram
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reactionData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Reaction" tick={{ fontSize: 12 }}>
                    <Label
                      value="Number of Reactions per Comment"
                      offset={-10}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label
                      value="Number of Comments"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip
                    formatter={(value) => [`${value}`, "Comments"]}
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  />
                  <Bar dataKey="Count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Count" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ✅ Detailed Comments Section */}
        {comments.length > 0 && (
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              All Comments ({comments.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">Comment</th>
                    <th className="p-2 text-left">Reactions</th>
                    <th className="p-2 text-left">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((c, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <a
                          href={c.author?.profile_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {c.author?.name || "Unknown"}
                        </a>
                      </td>
                      <td className="p-2 text-gray-800">{c.text}</td>
                      <td className="p-2">{c.stats?.total_reactions || 0}</td>
                      <td className="p-2 text-gray-500">
                        {c.posted_at?.date || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ Raw JSON Viewer
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Raw JSON Response:
          </h3>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs text-gray-800">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div> */}
      </div>
    );
  };

  return (
    <TabContainer
      title="Comment Analytics"
      onSubmit={handleSubmit}
      TableComponent={AnalyticsTable}
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
    </TabContainer>
  );
};

export default AnalyticsTab;
