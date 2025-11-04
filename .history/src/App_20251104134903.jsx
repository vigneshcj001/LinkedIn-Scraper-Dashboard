import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import ProfileTab from "./components/tabs/ProfileTab";
import PostsTab from "./components/tabs/PostsTab";
import CommentsTab from "./components/tabs/CommentsTab";
import CompanyTab from "./components/tabs/CompanyTab";
import AnalyticsTab from "./components/tabs/AnalyticsTab";
import ReactionsTab from "./components/tabs/ReactionsTab";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  const [rapidApiKey, setRapidApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load API key from local storage
  useEffect(() => {
    const storedKey = localStorage.getItem("rapidApiKey");
    if (storedKey) setRapidApiKey(storedKey);
  }, []);

  // Save API key
  useEffect(() => {
    if (rapidApiKey) localStorage.setItem("rapidApiKey", rapidApiKey);
    else localStorage.removeItem("rapidApiKey");
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
    const sharedProps = { fetchData, loading, error, response };
    switch (activeTab) {
      case "profile":
        return <ProfileTab {...sharedProps} />;
      case "posts":
        return <PostsTab {...sharedProps} />;
      case "comments":
        return <CommentsTab {...sharedProps} />;
      case "company":
        return <CompanyTab {...sharedProps} />;
      case "analytics":
        return <AnalyticsTab {...sharedProps} />;
      case "reactions":
        return <ReactionsTab {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-12 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        LinkedIn Scraper Dashboard
      </h1>

      {/* --- API Key Section --- */}
      <div className="max-w-10xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          RapidAPI Key Configuration
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="password"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your RapidAPI Key"
            value={rapidApiKey}
            onChange={(e) => setRapidApiKey(e.target.value)}
          />
          <button
            onClick={() => toast.success("Key saved to local storage!")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Key
          </button>
          <Toaster position="bottom-right" />
        </div>
        {!rapidApiKey && (
          <p className="mt-4 text-red-500">
            Please enter your RapidAPI Key to make requests.
          </p>
        )}
      </div>

      {/* --- Tabs Navigation --- */}
      <div className="max-w-10xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex space-x-10 px-10 min-w-max sm:justify-center"
            aria-label="Tabs"
          >
            {[
              { name: "Profile Details", id: "profile" },
              { name: "Profile Posts", id: "posts" },
              { name: "Post Comments", id: "comments" },
              { name: "Company Details", id: "company" },
              { name: "Comment Analytics", id: "analytics" },
              { name: "Post Reactions", id: "reactions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  tab.id === activeTab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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

export default App;
