// AdminEvents.jsx (Part 1)

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus2,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/events");

      setEvents(
        Array.isArray(res.data?.events)
          ? res.data.events
          : Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        title,
        description,
        event_date: eventDate,
        location,
      });

      toast.success("Event created successfully.");

      setTitle("");
      setEventDate("");
      setLocation("");
      setDescription("");

      fetchEvents();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create event.");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );

      toast.success("Event deleted.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete event.");
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      `${event.title} ${event.location} ${event.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / rowsPerPage)
  );

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.event_date) >= new Date()
  ).length;

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "date",
      label: "Date",
      render: (event) =>
        event.event_date
          ? new Date(
              event.event_date
            ).toLocaleDateString()
          : "N/A",
    },
    {
      key: "location",
      label: "Location",
      render: (event) =>
        event.location || "N/A",
    },
    {
      key: "description",
      label: "Description",
      render: (event) => event.description,
    },
    {
      key: "actions",
      label: "Actions",
      render: (event) => (
        <button
          onClick={() => deleteEvent(event.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      ),
    },
  ];
  // AdminEvents.jsx (Part 2)

  let eventsContent;

  if (loading) {
    eventsContent = (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
        <p className="text-gray-500">
          Loading events...
        </p>
      </div>
    );
  } else if (paginatedEvents.length === 0) {
    eventsContent = (
      <TableEmpty message="No events found." />
    );
  } else {
    eventsContent = (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedEvents}
            rowKey="id"
          />
        </div>

        <div className="mt-6">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() =>
              setCurrentPage((page) =>
                Math.max(1, page - 1)
              )
            }
            onNext={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Events Management"
          subtitle="Create and manage society events"
        />

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CalendarDays
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Total Events
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {events.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CalendarPlus2
              size={30}
              className="text-green-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Upcoming Events
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {upcomingEvents}
            </h2>
          </div>
        </div>

        {/* Create Event */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            <CalendarPlus2 size={22} />
            Create Event
          </h2>

          <form
            onSubmit={addEvent}
            className="grid md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900 dark:border-gray-700"
              required
            />

            <input
              type="date"
              value={eventDate}
              onChange={(e) =>
                setEventDate(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900 dark:border-gray-700"
              required
            />

            <input
              type="text"
              placeholder="Event Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="border rounded-xl px-4 py-3 md:col-span-2 dark:bg-gray-900 dark:border-gray-700"
            />

            <textarea
              rows={4}
              placeholder="Event Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="border rounded-xl px-4 py-3 md:col-span-2 dark:bg-gray-900 dark:border-gray-700"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 md:col-span-2 transition font-medium"
            >
              Create Event
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search events..."
          />
        </div>

        {/* Events Table */}
        {eventsContent}
      </motion.div>
    </div>
  );
}

export default AdminEvents;