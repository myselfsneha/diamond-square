import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";

const YEARS = [2024, 2025, 2026, 2027];

const EMPTY_REPORT = {
  summary: {},
  complaints: [],
  maintenance: [],
  residents: [],
  events: [],
};

const calculateTotal = (data = [], key) =>
  Array.isArray(data)
    ? data.reduce(
        (sum, item) => sum + Number(item?.[key] || 0),
        0
      )
    : 0;

function AdminReports() {
  const [report, setReport] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/reports?year=${year}`
      );

      setReport(res.data || EMPTY_REPORT);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load reports.");

      setReport(EMPTY_REPORT);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const summary = report.summary || {};

  const totalComplaints = useMemo(
    () =>
      calculateTotal(
        report.complaints,
        "total"
      ),
    [report.complaints]
  );

  const totalCollection = useMemo(
    () =>
      calculateTotal(
        report.maintenance,
        "collection"
      ),
    [report.maintenance]
  );

  const totalEvents = useMemo(
    () =>
      calculateTotal(
        report.events,
        "total"
      ),
    [report.events]
  );

  const renderMonthlyData = (
    data,
    valueKey,
    valueClass,
    prefix = ""
  ) => {
    if (!Array.isArray(data) || !data.length) {
      return (
        <p className="text-center text-gray-500 py-6">
          No data available.
        </p>
      );
    }

    return data.map((item) => (
      <div
        key={item.month}
        className="flex justify-between items-center border-b last:border-0 py-2"
      >
        <span>{item.month}</span>

        <span
          className={`font-semibold ${valueClass}`}
        >
          {prefix}
          {item[valueKey]}
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Reports & Analytics"
          subtitle={`Analytics for ${year}`}
          buttonText="Refresh"
          onButtonClick={fetchReport}
        />

        <div className="flex justify-end mb-6">
          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="border rounded-lg px-4 py-2"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            Loading reports...
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-5 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <p className="text-gray-500">
                  Residents
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {summary.totalResidents || 0}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <p className="text-gray-500">
                  Complaints
                </p>

                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {totalComplaints}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <p className="text-gray-500">
                  Collection
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  ₹{totalCollection}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <p className="text-gray-500">
                  Events
                </p>

                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {totalEvents}
                </h2>
              </div>
            </div>
                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-5">
                  Monthly Complaints
                </h2>

                <div className="space-y-2">
                  {renderMonthlyData(
                    report.complaints,
                    "total",
                    "text-red-600"
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-5">
                  Monthly Collection
                </h2>

                <div className="space-y-2">
                  {renderMonthlyData(
                    report.maintenance,
                    "collection",
                    "text-green-600",
                    "₹"
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-5">
                  Resident Growth
                </h2>

                <div className="space-y-2">
                  {renderMonthlyData(
                    report.residents,
                    "total",
                    "text-blue-600"
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-5">
                  Event Statistics
                </h2>

                <div className="space-y-2">
                  {renderMonthlyData(
                    report.events,
                    "total",
                    "text-purple-600"
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminReports;