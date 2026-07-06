import { useEffect, useMemo, useState } from "react";
import {
  User,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Bell,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import DataTable from "../components/table/DataTable";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function ResidentDashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    resident: {},
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    recentComplaints: [],
    upcomingEvents: [],
    latestNotices: [],
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/dashboard/resident");
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Complaints",
      value: dashboard.totalComplaints,
      color: "from-red-500 to-pink-500",
      icon: AlertTriangle,
    },
    {
      title: "Resolved",
      value: dashboard.resolvedComplaints,
      color: "from-green-500 to-emerald-500",
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: dashboard.pendingComplaints,
      color: "from-yellow-500 to-orange-500",
      icon: AlertTriangle,
    },
  ];

  const filteredComplaints = useMemo(() => {
    return dashboard.recentComplaints.filter((item) =>
      `${item.title} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [dashboard.recentComplaints, search]);

  const complaintColumns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "created_at",
      label: "Date",
      render: (item) =>
        new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <User size={40} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Welcome{" "}
                {dashboard.resident?.name || "Resident"}
              </h1>

              <p className="opacity-90">
                Flat : {dashboard.resident?.flat_number}
              </p>

              <p className="opacity-90">
                Status :{" "}
                {dashboard.resident?.approval_status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                      {loading ? "--" : card.value}
                    </h2>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${card.color} p-4 rounded-xl text-white`}
                  >
                    <Icon size={30} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="text-blue-600" />
              <h2 className="text-xl font-semibold">
                Upcoming Events
              </h2>
            </div>

            {dashboard.upcomingEvents.length === 0 ? (
              <TableEmpty message="No upcoming events." />
            ) : (
              dashboard.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b py-3"
                >
                  <h3 className="font-semibold">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      event.event_date
                    ).toLocaleDateString()}
                  </p>

                  <p>{event.location}</p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="text-yellow-500" />
              <h2 className="text-xl font-semibold">
                Latest Notices
              </h2>
            </div>

            {dashboard.latestNotices.length === 0 ? (
              <TableEmpty message="No notices available." />
            ) : (
              dashboard.latestNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border-b py-3"
                >
                  <h3 className="font-semibold">
                    {notice.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      notice.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <TableHeader
          title="Recent Complaints"
          subtitle={`Total : ${filteredComplaints.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
          />
        </div>

        {filteredComplaints.length === 0 ? (
          <TableEmpty message="No complaints found." />
        ) : (
          <DataTable
            columns={complaintColumns}
            data={filteredComplaints}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
}

export default ResidentDashboard;