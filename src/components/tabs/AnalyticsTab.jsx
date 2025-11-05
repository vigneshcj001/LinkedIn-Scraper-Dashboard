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

  const AnalyticsTable = ({ data }) => {
    const summary = data?.summary || {};
    const comments = data?.comments || [];

    if (!summary.total_comments) return null;

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

    // ✅ Export Handlers (based on ProfileTab logic)
    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_data.json`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const exportCSV = () => {
      const csvSections = [];

      // ---- Summary ----
      csvSections.push("Summary");
      csvSections.push("Metric,Value");
      csvSections.push(
        ...filteredSummary.map(
          (r) => `"${r.Metric}","${r.Value?.toString().replace(/"/g, '""')}"`
        )
      );
      csvSections.push("");

      // ---- Top Commenters ----
      if (topCommenters.length) {
        csvSections.push("Top Commenters");
        csvSections.push("Name,Comments");
        csvSections.push(
          ...topCommenters.map(
            ([name, count]) => `"${name?.replace(/"/g, '""')}","${count || 0}"`
          )
        );
        csvSections.push("");
      }

      // ---- Reaction Histogram ----
      if (reactionData.length) {
        csvSections.push("Reaction Histogram");
        csvSections.push("Reaction,Count");
        csvSections.push(
          ...reactionData.map(
            (r) =>
              `"${r.Reaction?.replace(/"/g, '""')}","${
                r.Count?.toString() || 0
              }"`
          )
        );
        csvSections.push("");
      }

      // ---- Comments ----
      if (comments.length) {
        csvSections.push("Comments");
        csvSections.push(
          "Author,Headline,Comment,Reactions,Posted,Profile URL"
        );
        csvSections.push(
          ...comments.map((c) =>
            [
              c.author?.name || "-",
              c.author?.headline || "-",
              c.text || "-",
              c.stats?.total_reactions || 0,
              c.posted_at?.date || "-",
              c.author?.profile_url || "-",
            ]
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(",")
          )
        );
      }

      const blob = new Blob([csvSections.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_data.csv`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-8">
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
