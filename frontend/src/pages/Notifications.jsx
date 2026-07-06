import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/resident");

      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_read: 1 }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch = `${item.title || ""} ${item.message || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        item.type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [notifications, search, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / rowsPerPage)
  );

  const currentNotifications = filteredNotifications.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "message",
      label: "Message",
    },
    {
      key: "type",
      label: "Type",
      render: (item) =>
        item.type
          ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
          : "-",
    },
    {
      key: "is_read",
      label: "Status",
      render: (item) =>
        item.is_read ? (
          <span className="text-green-600 font-semibold">
            Read
          </span>
        ) : (
          <span className="text-red-600 font-semibold">
            Unread
          </span>
        ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (item) =>
        new Date(item.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) =>
        !item.is_read ? (
          <button
            onClick={() => markAsRead(item.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
          >
            Mark Read
          </button>
        ) : (
          <span className="text-green-600 font-medium">
            ✓ Done
          </span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Notifications"
          subtitle={`Total Notifications: ${filteredNotifications.length}`}
        />

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search notifications..."
          />

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-4 py-2 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="emergency">Emergency</option>
            <option value="event">Event</option>
            <option value="notice">Notice</option>
            <option value="complaint">Complaint</option>
            <option value="payment">Payment</option>
          </select>
        </div>

        {filteredNotifications.length === 0 ? (
          <TableEmpty message="No notifications available." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentNotifications}
              rowKey="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Notifications;