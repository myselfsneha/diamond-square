import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [search, setSearch] = useState("");

  const profileData = useMemo(
    () => [
      {
        field: "Name",
        value: user.name || "N/A",
      },
      {
        field: "Phone",
        value: user.phone || "N/A",
      },
      {
        field: "Email",
        value: user.email || "N/A",
      },
      {
        field: "Role",
        value: user.role || "Resident",
      },
      {
        field: "Flat Number",
        value: user.flat_number || "N/A",
      },
    ],
    [user]
  );

  const filteredData = profileData.filter((item) =>
    `${item.field} ${item.value}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "field",
      label: "Field",
    },
    {
      key: "value",
      label: "Value",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <TableHeader
          title="My Profile"
          subtitle="Profile Information"
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search profile..."
          />
        </div>

        {filteredData.length === 0 ? (
          <TableEmpty message="No profile information found." />
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            rowKey="field"
          />
        )}
      </div>
    </div>
  );
}

export default Profile;