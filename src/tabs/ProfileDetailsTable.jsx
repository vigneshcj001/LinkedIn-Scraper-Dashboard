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
        data={profileData.map((item) => ({ Key: item.key, Value: item.value }))}
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
export default ProfileDetailsTable;