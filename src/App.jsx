import React, { useState, useEffect } from "react";

const API_BASE_URL ="http://linkedin-scraper-dashboard-backend.onrender.com/api";
function App() {
  const [rapidApiKey, setRapidApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load API key from local storage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("rapidApiKey");
    if (storedKey) {
      setRapidApiKey(storedKey);
    }
  }, []);

  // Save API key to local storage when it changes
  useEffect(() => {
    if (rapidApiKey) {
      localStorage.setItem("rapidApiKey", rapidApiKey);
    } else {
      localStorage.removeItem("rapidApiKey");
    }
  }, [rapidApiKey]);

  const fetchData = async (endpoint, params = {}) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    if (!rapidApiKey) {
      setError("Please enter your RapidAPI Key.");
      setLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/${endpoint}${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            fetchData={fetchData}
            loading={loading}
            error={error}
            response={response}
          />
        );
      case "posts":
        return (
          <PostsTab
            fetchData={fetchData}
            loading={loading}
            error={error}
            response={response}
          />
        );
      case "comments":
        return (
          <CommentsTab
            fetchData={fetchData}
            loading={loading}
            error={error}
            response={response}
          />
        );
      case "company":
        return (
          <CompanyTab
            fetchData={fetchData}
            loading={loading}
            error={error}
            response={response}
          />
        );
      case "analytics":
        return (
          <AnalyticsTab
            fetchData={fetchData}
            loading={loading}
            error={error}
            response={response}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        LinkedIn Scraper Dashboard
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          RapidAPI Key Configuration
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="password" // Use password type for security
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your RapidAPI Key"
            value={rapidApiKey}
            onChange={(e) => setRapidApiKey(e.target.value)}
          />
          <button
            onClick={() => alert("Key saved to browser's local storage.")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Key
          </button>
        </div>
        {!rapidApiKey && (
          <p className="mt-4 text-red-500">
            Please enter your RapidAPI Key to make requests.
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { name: "Profile Details", id: "profile" },
              { name: "Profile Posts", id: "posts" },
              { name: "Post Comments", id: "comments" },
              { name: "Company Details", id: "company" },
              { name: "Comment Analytics", id: "analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${
                    tab.id === activeTab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}

// --- Reusable Data Table Component ---
const DataTable = ({ data, columns, title }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-600">No data available for {title}.</p>;
  }

  // Ensure all columns exist in data for headers, or use provided columns
  const tableColumns = columns || Object.keys(data[0]);

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6">
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {tableColumns.map((col) => (
              <th key={col} scope="col" className="px-6 py-3">
                {col.replace(/_/g, " ")} {/* Make headers more readable */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {tableColumns.map((col) => (
                <td key={col} className="px-6 py-4">
                  {/* Check if the value is a React element (JSX) */}
                  {
                    row[col] &&
                    typeof row[col] === "object" &&
                    row[col].hasOwnProperty("$$typeof")
                      ? row[col] // Render the JSX directly
                      : row[col]
                      ? String(row[col])
                      : "-" // Otherwise, convert to string or show "-"
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Tab Components ---

const TabContainer = ({
  title,
  children,
  onSubmit,
  loading,
  error,
  response,
  TableComponent, // New prop for custom table rendering
}) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      {children}
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
    </form>

    {error && (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )}

    {response && (
      <>
        {/* Render custom table component if provided */}
        {TableComponent && <TableComponent data={response} />}

        <div className="bg-gray-50 p-4 rounded-md shadow-inner mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Raw JSON Response:
          </h3>
          <pre className="whitespace-pre-wrap break-all text-xs bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </>
    )}
  </div>
);

const ProfileTab = ({ fetchData, ...props }) => {
  const [username, setUsername] = useState("neal-mohan"); // Example: Neal Mohan

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("profile", { username });
  };

  const ProfileDetailsTable = ({ data }) => {
    if (!data?.data?.basic_info) return null;

    const profile = data.data.basic_info;
    const experience = data.data.experience || [];
    const education = data.data.education || [];

    const profileData = [
      { key: "Full Name", value: profile.fullname },
      { key: "Headline", value: profile.headline },
      {
        key: "Profile URL",
        value: (
          <a
            href={profile.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Profile
          </a>
        ),
      },
      { key: "Location", value: profile.location?.full },
      { key: "Followers", value: profile.follower_count },
      { key: "Connections", value: profile.connection_count },
      { key: "Current Company", value: profile.current_company },
    ];

    return (
      <>
        {/* --- Profile Header Card --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {profile.background_picture_url && (
            <div
              className="h-40 bg-cover bg-center"
              style={{
                backgroundImage: `url(${profile.background_picture_url})`,
              }}
            />
          )}

          <div className="p-6 flex items-center space-x-6">
            {profile.profile_picture_url && (
              <img
                src={profile.profile_picture_url}
                alt={profile.fullname}
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.fullname}
              </h2>
              <p className="text-gray-600">{profile.headline}</p>
              {profile.location?.full && (
                <p className="text-gray-500 mt-1">{profile.location.full}</p>
              )}
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Visit LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* --- Basic Info Table --- */}
        <DataTable
          title="Basic Profile Information"
          data={profileData.map((item) => ({
            Key: item.key,
            Value: item.value,
          }))}
          columns={["Key", "Value"]}
        />

        {/* --- Experience --- */}
        {experience.length > 0 && (
          <DataTable
            title="Experience"
            data={experience.map((exp) => ({
              Title: exp.title,
              Company: exp.company,
              Duration: exp.duration,
              Link: exp.company_linkedin_url ? (
                <a
                  href={exp.company_linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Company
                </a>
              ) : (
                "-"
              ),
            }))}
            columns={["Title", "Company", "Duration", "Link"]}
          />
        )}

        {/* --- Education --- */}
        {education.length > 0 && (
          <DataTable
            title="Education"
            data={education.map((edu) => ({
              School: edu.school,
              Degree: edu.degree_name,
              Field: edu.field_of_study,
              Duration: edu.duration,
              Link: edu.school_linkedin_url ? (
                <a
                  href={edu.school_linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View School
                </a>
              ) : (
                "-"
              ),
            }))}
            columns={["School", "Degree", "Field", "Duration", "Link"]}
          />
        )}
      </>
    );
  };

  return (
    <TabContainer
      title="Get Profile Details"
      onSubmit={handleSubmit}
      TableComponent={ProfileDetailsTable}
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
    </TabContainer>
  );
};

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

const CommentsTab = ({ fetchData, ...props }) => {
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

  const CommentsDataTable = ({ data }) => {
    const comments = data?.data?.comments || [];
    return (
      <DataTable
        title="Post Comments"
        data={comments.map((comment) => ({
          Commenter: comment.author?.name || "N/A", // Corrected path
          Headline: comment.author?.headline || "N/A", // Corrected path
          Text: comment.text ? `${comment.text.substring(0, 100)}...` : "N/A",
          Reactions: comment.stats?.total_reactions || 0,
          Posted: comment.posted_at?.relative || "N/A", // Corrected path
          Link: comment.comment_url ? ( // Corrected field name
            <a
              href={comment.comment_url} // Corrected field name
              target="_blank"
              rel="noopener noreferrer"
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
      <select
        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option>Most relevant</option>
        <option>Most recent</option>
      </select>
    </TabContainer>
  );
};

const CompanyTab = ({ fetchData, ...props }) => {
  const [identifier, setIdentifier] = useState("16140"); // Example: YouTube Company ID

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("company", { identifier });
  };

  const CompanyDetailsTable = ({ data }) => {
    if (!data?.data?.basic_info) return null;
    const company = data.data.basic_info;

    const companyData = [
      { key: "Company Name", value: company.name }, // Corrected from company_name
      {
        key: "Tagline",
        value: company.description
          ? `${company.description.substring(0, 100)}...`
          : "-",
      }, // Corrected from tagline, added truncation
      {
        key: "LinkedIn URL",
        value: (
          <a
            href={company.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Link
          </a>
        ),
      },
      {
        key: "Website",
        value: company.website ? ( // Corrected from website_url
          <a
            href={company.website} // Corrected from website_url
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {company.website}
          </a>
        ) : (
          "-"
        ),
      },
      {
        key: "Industry",
        value: company.industries?.join(", ") || "-",
      }, // Corrected from industry
      { key: "Company Type", value: company.page_type || "-" }, // Corrected from company_type
      {
        key: "Headquarters",
        value:
          `${data.data.locations?.headquarters?.city}, ${data.data.locations?.headquarters?.country}` ||
          "-",
      }, // Corrected path
      { key: "Followers", value: data.data.stats?.follower_count || "-" }, // Corrected path
      {
        key: "Employees",
        value: data.data.stats?.employee_count_range
          ? `${data.data.stats.employee_count_range.start} - ${data.data.stats.employee_count_range.end}`
          : "-",
      }, // Corrected path
    ];

    return (
      <DataTable
        title="Company Information"
        data={companyData.map((item) => ({ Key: item.key, Value: item.value }))}
        columns={["Key", "Value"]}
      />
    );
  };

  return (
    <TabContainer
      title="Get Company Details"
      onSubmit={handleSubmit}
      TableComponent={CompanyDetailsTable}
      {...props}
    >
      <input
        type="text"
        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter LinkedIn Company ID (e.g., 16140 for YouTube)"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
    </TabContainer>
  );
};

const AnalyticsTab = ({ fetchData, ...props }) => {
  const [postUrl, setPostUrl] = useState(
    "https://www.linkedin.com/posts/satyanadella_were-taking-the-next-big-step-with-researcher-ugcPost-7389713443714469888-B-oo"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("analytics/comments", { post_url: postUrl });
  };

  const AnalyticsTable = ({ data }) => {
    if (!data?.summary) return null;

    const summary = data.summary;
    const analyticsData = [
      { key: "Total Comments", value: summary.total_comments },
      { key: "Unique Commenters", value: summary.unique_commenters },
      { key: "Average Reactions", value: summary.average_reactions.toFixed(2) },
    ];

    const topCommentersData = summary.top_commenters.map(([name, count]) => ({
      Commenter: name,
      "Comment Count": count,
    }));

    // Convert reactionHistogram to an array of objects for DataTable
    const reactionHistogramData = Object.entries(
      summary.reaction_histogram || {}
    ).map(([reactions, count]) => ({
      "Reactions Count": reactions,
      "Number of Comments": count,
    }));

    return (
      <>
        <DataTable
          title="Comment Analytics Summary"
          data={analyticsData.map((item) => ({
            Key: item.key,
            Value: item.value,
          }))}
          columns={["Key", "Value"]}
        />
        {topCommentersData.length > 0 && (
          <DataTable
            title="Top 5 Commenters"
            data={topCommentersData}
            columns={["Commenter", "Comment Count"]}
          />
        )}
        {reactionHistogramData.length > 0 && (
          <DataTable
            title="Reaction Histogram"
            data={reactionHistogramData}
            columns={["Reactions Count", "Number of Comments"]}
          />
        )}
        {data.comments && data.comments.length > 0 && (
          <DataTable
            title="All Comments (for Analytics)"
            data={data.comments.map((comment) => ({
              Commenter: comment.author?.name || "N/A",
              Headline: comment.author?.headline || "N/A",
              Text: comment.text
                ? `${comment.text.substring(0, 100)}...`
                : "N/A",
              Reactions: comment.stats?.total_reactions || 0,
              Posted: comment.posted_at?.relative || "N/A",
              Link: comment.comment_url ? (
                <a
                  href={comment.comment_url}
                  target="_blank"
                  rel="noopener noreferrer"
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
        )}
      </>
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
        placeholder="Enter LinkedIn Post URL for analytics"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        required
      />
    </TabContainer>
  );
};

export default App;
