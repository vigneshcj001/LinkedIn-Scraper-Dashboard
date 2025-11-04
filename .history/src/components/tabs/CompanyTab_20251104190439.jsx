import React, { useState } from "react";
import DataTable from "../DataTable";
import TabContainer from "../TabContainer";

const CompanyTab = ({ fetchData, ...props }) => {
  const [identifier, setIdentifier] = useState("ceiyone");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData("company", { identifier });
  };

  const CompanyDetailsTable = ({ data }) => {
    const company = data?.data?.basic_info || data?.basic_info || {};
    const stats = data?.data?.stats || {};
    const locations = data?.data?.locations || {};
    const media = data?.data?.media || {};
    const funding = data?.data?.funding || {};
    const links = data?.data?.links || {};

    if (!company.name) return <p>No company data found.</p>;

    // ✅ Basic Info
    const basicInfoRows = [
      { Key: "Name", Value: company.name },
      { Key: "Tagline", Value: company.description },
      {
        Key: "LinkedIn URL",
        Value: (
          <a
            href={company.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {company.linkedin_url}
          </a>
        ),
      },
      {
        Key: "Website",
        Value: (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {company.website}
          </a>
        ),
      },
      { Key: "Industry", Value: (company.industries || []).join(", ") },
      {
        Key: "Specialties",
        Value: (company.specialties || []).join(", "),
      },
      {
        Key: "Founded",
        Value: company.founded_info?.year
          ? `${company.founded_info.year}`
          : "-",
      },
      { Key: "Verified", Value: company.is_verified ? "✅ Yes" : "❌ No" },
    ];

    // ✅ Stats
    const statsRows = [
      { Key: "Followers", Value: stats.follower_count || "-" },
      { Key: "Employees", Value: stats.employee_count || "-" },
      {
        Key: "Employee Range",
        Value: stats.employee_count_range
          ? `${stats.employee_count_range.start} - ${stats.employee_count_range.end}`
          : "-",
      },
      { Key: "Students", Value: stats.student_count || "-" },
    ];

    // ✅ Location
    const hq = locations.headquarters || {};
    const locationRows = [
      { Key: "Country", Value: hq.country || "-" },
      { Key: "State", Value: hq.state || "-" },
      { Key: "City", Value: hq.city || "-" },
      { Key: "Postal Code", Value: hq.postal_code || "-" },
      { Key: "Address", Value: `${hq.line1 || ""} ${hq.line2 || ""}` },
      { Key: "Description", Value: hq.description || "-" },
      {
        Key: "Coordinates",
        Value: locations.geo_coordinates
          ? `${locations.geo_coordinates.latitude}, ${locations.geo_coordinates.longitude}`
          : "-",
      },
    ];

    // ✅ Media
    const mediaRows = [
      {
        Key: "Logo",
        Value: media.logo_url ? (
          <img
            src={media.logo_url}
            alt="Logo"
            className="w-20 h-20 object-contain rounded"
          />
        ) : (
          "-"
        ),
      },
      {
        Key: "Cover",
        Value: media.cover_url ? (
          <img
            src={media.cover_url}
            alt="Cover"
            className="w-full h-32 object-cover rounded"
          />
        ) : (
          "-"
        ),
      },
    ];

    // ✅ Funding
    const fundingRows = [
      { Key: "Total Rounds", Value: funding.total_rounds || "-" },
      { Key: "Latest Round Type", Value: funding.latest_round?.type || "-" },
      { Key: "Latest Round Date", Value: funding.latest_round?.date || "-" },
      { Key: "Investors", Value: funding.latest_round?.investors_count || "-" },
      {
        Key: "Crunchbase URL",
        Value: funding.crunchbase_url ? (
          <a
            href={funding.crunchbase_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {funding.crunchbase_url}
          </a>
        ) : (
          "-"
        ),
      },
    ];

    // ✅ Links
    const linksRows = Object.entries(links).map(([key, val]) => ({
      Key: key.charAt(0).toUpperCase() + key.slice(1),
      Value: val ? (
        <a
          href={val}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          {val}
        </a>
      ) : (
        "-"
      ),
    }));

    return (
      <div className="space-y-8">
        {/* Basic Info */}
        <DataTable
          title="🏢 Company Information"
          data={basicInfoRows}
          columns={["Key", "Value"]}
        />

        {/* Stats */}
        <DataTable
          title="📊 Company Stats"
          data={statsRows}
          columns={["Key", "Value"]}
        />

        {/* Locations */}
        <DataTable
          title="📍 Headquarters"
          data={locationRows}
          columns={["Key", "Value"]}
        />

        {/* Media */}
        <DataTable
          title="🖼️ Media"
          data={mediaRows}
          columns={["Key", "Value"]}
        />

        {/* Funding */}
        <DataTable
          title="💰 Funding Information"
          data={fundingRows}
          columns={["Key", "Value"]}
        />

        {/* Links */}
        <DataTable
          title="🔗 Links"
          data={linksRows}
          columns={["Key", "Value"]}
        />

      </div>
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
        placeholder="Enter LinkedIn Company Identifier"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
    </TabContainer>
  );
};

export default CompanyTab;
