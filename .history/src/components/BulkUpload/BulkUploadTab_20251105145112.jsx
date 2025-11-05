import React, { useState } from "react";
import BulkProfileUploadTab from "./BulkProfileUploadTab";
import BulkPostsUploadTab from "./BulkPostsUploadTab";
import BulkCommentsUploadTab from "./BulkCommentsUploadTab";
import BulkCompaniesUploadTab from "./BulkCompaniesUploadTab";
import BulkCommentAnalyticsUploadTab from "./BulkCommentAnalyticsUploadTab";
import BulkReactionsUploadTab from "./BulkReactionsUploadTab";

const BulkUploadTab = () => {
  const [activeBulkTab, setActiveBulkTab] = useState("profiles"); // Default active bulk tab

  const renderBulkTabContent = () => {
    switch (activeBulkTab) {
      case "profiles":
        return <BulkProfileUploadTab />;
      case "posts":
        return <BulkPostsUploadTab />;
      case "comments":
        return <BulkCommentsUploadTab />;
      case "companies":
        return <BulkCompaniesUploadTab />;
      case "analytics":
        return <BulkCommentAnalyticsUploadTab />;
      case "reactions":
        return <BulkReactionsUploadTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-10xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8 px-8"
          aria-label="Bulk Upload Tabs"
        >
          {[
            { name: "Profile Details", id: "profiles" },
            { name: "Posts", id: "posts" },
            { name: "Comments", id: "comments" },
            { name: "Companies", id: "companies" },
            { name: "Comment Analytics", id: "analytics" },
            { name: "Post Reactions", id: "reactions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveBulkTab(tab.id)}
              className={`${
                tab.id === activeBulkTab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">{renderBulkTabContent()}</div>
    </div>
  );
};

export default BulkUploadTab;
