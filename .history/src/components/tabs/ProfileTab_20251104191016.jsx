import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const ProfileTab = ({ fetchData, ...props }) => {
  const [username, setUsername] = useState("ganapathy-subburathinam");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("profile", { username });
  };

  const ProfileDetailsTable = ({ data }) => {
    if (!data?.data?.basic_info) return null;
    const profile = data.data.basic_info;
    const experience = data.data.experience || [];
    const education = data.data.education || [];

    // ✅ Export Handlers
    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_profile.json`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const exportCSV = () => {
      const csvSections = [];

      // Basic Info
      const basicInfo = [
        ["Full Name", profile.fullname],
        ["Headline", profile.headline],
        ["Profile URL", profile.profile_url],
        ["Location", profile.location?.full || "-"],
        ["Followers", profile.follower_count],
        ["Connections", profile.connection_count],
        ["Current Company", profile.current_company],
      ];
      csvSections.push("Basic Info");
      csvSections.push("Key,Value");
      csvSections.push(...basicInfo.map((r) => `"${r[0]}","${r[1] || "-"}"`));
      csvSections.push("");

      // Experience
      if (experience.length) {
        csvSections.push("Experience");
        csvSections.push("Title,Company,Duration,Company URL");
        csvSections.push(
          ...experience.map(
            (exp) =>
              `"${exp.title}","${exp.company}","${exp.duration}","${
                exp.company_linkedin_url || "-"
              }"`
          )
        );
        csvSections.push("");
      }

      // Education
      if (education.length) {
        csvSections.push("Education");
        csvSections.push("School,Degree,Field,Duration,School URL");
        csvSections.push(
          ...education.map(
            (edu) =>
              `"${edu.school}","${edu.degree_name}","${edu.field_of_study}","${
                edu.duration
              }","${edu.school_linkedin_url || "-"}"`
          )
        );
      }

      const blob = new Blob([csvSections.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_profile.csv`;
      link.click();
      URL.revokeObjectURL(url);
    };

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

        {/* Header Card */}
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

        {/* Basic Info */}
        <DataTable
          title="Basic Profile Information"
          data={profileData.map((item) => ({
            Key: item.key,
            Value: item.value,
          }))}
          columns={["Key", "Value"]}
        />

        {/* Experience */}
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

        {/* Education */}
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
        placeholder="Enter LinkedIn username (e.g., ganapathy-subburathinam)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </TabContainer>
  );
};

export default ProfileTab;
