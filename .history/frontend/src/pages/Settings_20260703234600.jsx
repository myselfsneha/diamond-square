import { useState } from "react";
import Navbar from "../components/Navbar";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function AdminSettings() {
  const [search, setSearch] = useState("");

  const settings = [
    {
      id: 1,
      setting: "Society Name",
      value: "Diamond Square",
    },
    {
      id: 2,
      setting: "Theme",
      value: "Light",
    },
    {
      id: 3,
      setting: "Notifications",
      value: "Enabled",
    },
    {
      id: 4,
      setting: "Maintenance Due Date",
      value: "10th of every month",
    },
    {
      id: 5,
      setting: "Version",
      value: "1.0.0",
    },
  ];

  const filteredSettings = settings.filter((item) =>
    `${item.setting} ${item.value}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "setting",
      label: "Setting",
    },
    {
      key: "value",
      label: "Value",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <TableHeader
          title="Admin Settings"
          subtitle={`Total Settings: ${filteredSettings.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search settings..."
          />
        </div>

        {filteredSettings.length === 0 ? (
          <TableEmpty message="No settings found." />
        ) : (
          <DataTable
            columns={columns}
            data={filteredSettings}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
}

export default AdminSettings;