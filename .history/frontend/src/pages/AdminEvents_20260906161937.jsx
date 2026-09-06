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