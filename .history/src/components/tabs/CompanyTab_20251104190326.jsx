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
    if (!data || Object.keys(data).length === 0)
      return <p>No company data found.</p>;

    const company = data?.data?.basic_info || data?.basic_info || {};
    const stats = data?.data?.stats || {};
    const locations = data?.data?.locations || {};
    const media = data?.data?.media || {};
    const funding = data?.data?.funding || {};
    const links = data?.data?.links || {};

    if (!company.name) return <p>No company data found.</p>;

    // ✅ Export Helpers
    const handleExportJSON = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${company.name || "company"}_data.json`;
      link.click();
    };

    const handleExportCSV = () => {
      const flatten = (obj, prefix = "") =>
        Object.entries(obj).flatMap(([k, v]) =>
          typeof v === "object" && v !== null
            ? flatten(v, `${prefix}${k}.`)
            : [[`${prefix}${k}`, v]]
        );
      const flat = flatten(data);
      const csv =
        "Key,Value\n" +
        flat
          .map(([k, v]) => `"${k}","${String(v).replace(/"/g, '""')}"`)
          .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${company.name || "company"}_data.csv`;
      link.click();
    };

    // ✅ Data sections
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
      { Key: "Specialties", Value: (company.specialties || []).join(", ") },
      {
        Key: "Founded",
        Value: company.founded_info?.year || "-",
      },
      { Key: "Verified", Value: company.is_verified ? "✅ Yes" : "❌ No" },
    ];

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
        {/* Export Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Export CSV
          </button>
        </div>

        {/* Tables */}
        <DataTable
          title="🏢 Company Information"
          data={basicInfoRows}
          columns={["Key", "Value"]}
        />
        <DataTable
          title="📊 Company Stats"
          data={statsRows}
          columns={["Key", "Value"]}
        />
        <DataTable
          title="📍 Headquarters"
          data={locationRows}
          columns={["Key", "Value"]}
        />
        <DataTable
          title="🖼️ Media"
          data={mediaRows}
          columns={["Key", "Value"]}
        />
        <DataTable
          title="💰 Funding Information"
          data={fundingRows}
          columns={["Key", "Value"]}
        />
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
