// Part 1/4

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminReports() {
  const [report, setReport] = useState({
    summary: {},
    complaints: [],
    maintenance: [],
    residents: [],
    events: [],
  });

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReport();
  }, [year]);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports?year=${year}`);
      setReport(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const summary = report.summary || {};

  const totalComplaints = useMemo(
    () =>
      report.complaints.reduce(
        (a, b) => a + Number(b.total || 0),
        0
      ),
    [report]
  );

  const totalCollection = useMemo(
    () =>
      report.maintenance.reduce(
        (a, b) => a + Number(b.collection || 0),
        0
      ),
    [report]
  );

  const totalEvents = useMemo(
    () =>
      report.events.reduce(
        (a, b) => a + Number(b.total || 0),
        0
      ),
    [report]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-blue-600">
            Reports & Analytics
          </h1>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Residents</p>
            <h2 className="text-3xl font-bold mt-2">
              {summary.totalResidents || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Complaints</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {totalComplaints}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Collection</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalCollection}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">Events</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalEvents}
            </h2>
          </div>

        </div>
        // Part 2/4

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Complaint Report */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Monthly Complaints
            </h2>

            <div className="space-y-3">

              {report.complaints.length === 0 ? (
                <p className="text-gray-500">
                  No complaint data available.
                </p>
              ) : (
                report.complaints.map((item) => (
                  <div
                    key={item.month}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{item.month}</span>

                    <span className="font-semibold text-red-600">
                      {item.total}
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

          {/* Maintenance Collection */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Monthly Collection
            </h2>

            <div className="space-y-3">

              {report.maintenance.length === 0 ? (
                <p className="text-gray-500">
                  No maintenance data available.
                </p>
              ) : (
                report.maintenance.map((item) => (
                  <div
                    key={item.month}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{item.month}</span>

                    <span className="font-semibold text-green-600">
                      ₹{item.collection}
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Resident Growth */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Resident Growth
            </h2>

            <div className="space-y-3">

              {report.residents.length === 0 ? (
                <p className="text-gray-500">
                  No resident data available.
                </p>
              ) : (
                report.residents.map((item) => (
                  <div
                    key={item.month}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{item.month}</span>

                    <span className="font-semibold text-blue-600">
                      {item.total}
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>
          // Part 3/4

          {/* Event Statistics */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Event Statistics
            </h2>

            <div className="space-y-3">

              {report.events.length === 0 ? (
                <p className="text-gray-500">
                  No event data available.
                </p>
              ) : (
                report.events.map((item) => (
                  <div
                    key={item.month}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{item.month}</span>

                    <span className="font-semibold text-purple-600">
                      {item.total}
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
// Part 4/4

export default AdminReports;