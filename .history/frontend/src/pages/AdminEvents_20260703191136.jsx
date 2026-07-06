// AdminEvents.jsx (Part 1)

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminEvents() {
  const [events, setEvents] = useState([]);

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
      setEvents([]);
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

      await fetchEvents();

      setTitle("");
      setEventDate("");
      setLocation("");
      setDescription("");

      alert("Event created successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to create event");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );

      alert("Event deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete event");
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

  const tableRows = filteredEvents
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    )
    .map((event) => ({
      title: event.title,
      date: event.event_date
        ? new Date(event.event_date).toLocaleDateString()
        : "N/A",
      location: event.location || "N/A",
      description: event.description,
      actions: (
        <button
          onClick={() => deleteEvent(event.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      ),
    }));

  const columns = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];