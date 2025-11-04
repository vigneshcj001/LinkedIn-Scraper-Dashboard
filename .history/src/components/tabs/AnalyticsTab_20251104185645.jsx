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
    "https://www.linkedin.com/posts/chorouk-malmoum_ive-built-90-ai-agents-in-last-12-months-activity-7371091659725635584-8zS1"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("analytics/comments", { post_url: postUrl });
  };

  // ---------- Export JSON ----------
  const exportJSON = (data, filename = "analytics_data.json") => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Export CSV ----------
  const exportCSV = (data, filename = "analytics_data.csv") => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Table ----------
  const AnalyticsTable = ({ data }) => {
    const summary = data?.summary || {};
    const comments = data?.comments || [];

    if (!summary.total_comments) return <p>No analytics available.</p>;

    const topCommenters = summary.top_commenters || [];
    const reactionHistogram = summary.reaction_histogram || {};
    const reactionData = Object.entries(reactionHistogram).map(
      ([type, count]) => ({
        Reaction: type,
        Count: count,
      })
    );

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
        {/* ✅ Summary */}
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

        {/* ✅ Reaction Histogram */}
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
                      value="Reaction Type"
                      offset={-10}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label
                      value="Count"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey="Count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Count" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ✅ Export Buttons — now always visible */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => exportJSON(data)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium shadow-sm transition"
          >
            Export JSON
          </button>
          <button
            onClick={() => exportCSV(comments)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition"
          >
            Export CSV
          </button>
        </div>

        {/* ✅ Detailed Comments */}
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
