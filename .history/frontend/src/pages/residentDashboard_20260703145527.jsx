import { useEffect, useState } from "react";
import {
  User,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Bell,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800/20 p-4 rounded-full">
              <User size={40} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Welcome {dashboard.resident?.name || "Resident"}
              </h1>

              <p className="opacity-90 mt-1">
                Flat : {dashboard.resident?.flat_number}
              </p>

              <p className="opacity-90">
                Status : {dashboard.resident?.approval_status}
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">{card.title}</p>

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

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Events */}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="text-blue-600" />
              <h2 className="text-xl font-semibold">
                Upcoming Events
              </h2>
            </div>

            {dashboard.upcomingEvents.length === 0 ? (
              <p>No upcoming events.</p>
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

                  <p className="text-sm text-gray-800 dark:text-white">
                    {event.location}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Notices */}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="text-yellow-500" />
              <h2 className="text-xl font-semibold">
                Latest Notices
              </h2>
            </div>

            {dashboard.latestNotices.length === 0 ? (
              <p>No notices available.</p>
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

        {/* Recent Complaints */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Complaints
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-5 text-center"
                    >
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentComplaints.map(
                    (complaint) => (
                      <tr
                        key={complaint.id}
                        className="border-t"
                      >
                        <td className="p-3">
                          {complaint.title}
                        </td>

                        <td className="p-3">
                          {complaint.status}
                        </td>

                        <td className="p-3">
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResidentDashboard;