// Part 1/3

import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const YEARS = [2024, 2025, 2026, 2027];

const EMPTY_REPORT = {
  summary: {},
  complaints: [],
  maintenance: [],
  residents: [],
  events: [],
};

const calculateTotal = (items, field) =>
  items.reduce(
    (total, item) => total + Number(item[field] || 0),
    0
  );

function AdminReports() {
  const [report, setReport] = useState(EMPTY_REPORT);
  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const fetchReport = useCallback(async () => {
    try {
      const res = await api.get(
        `/reports?year=${year}`
      );

      setReport(res.data || EMPTY_REPORT);
    } catch (err) {
      console.log(err);
      setReport(EMPTY_REPORT);
    }
  }, [year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const summary = report.summary || {};

  const totalComplaints = useMemo(
    () => calculateTotal(report.complaints, "total"),
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
    () => calculateTotal(report.events, "total"),
    [report.events]
  );

  const renderMonthlyData = (
    data,
    valueKey,
    valueClass,
    prefix = ""
  ) => {
    if (data.length === 0) {
      return (
        <p className="text-gray-500">
          No data available.
        </p>
      );
    }

    return data.map((item) => (
      <div
        key={item.month}
        className="flex justify-between border-b pb-2"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Reports & Analytics
          </h1>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500">Residents</p>
            <h2 className="text-3xl font-bold mt-2">
              {summary.totalResidents || 0}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500">Complaints</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {totalComplaints}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500">Collection</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalCollection}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <p className="text-gray-500">Events</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalEvents}
            </h2>
          </div>
        </div>
        // Part 2/3

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">
              Monthly Complaints
            </h2>

            <div className="space-y-3">
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

            <div className="space-y-3">
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

            <div className="space-y-3">
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

            <div className="space-y-3">
              {renderMonthlyData(
                report.events,
                "total",
                "text-purple-600"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    