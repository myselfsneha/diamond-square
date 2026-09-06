// src/pages/Events.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  PartyPopper,
} from "lucide-react";

import Navbar from "../components/Navbar";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      `${event.title} ${event.description} ${event.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  const today = new Date();

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.event_date) >= today
  );

  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.event_date) < today
  );

  const EventCard = ({ event, upcoming }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold dark:text-white">
          {event.title}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            upcoming
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {upcoming ? "Upcoming" : "Past"}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-5">
        {event.description}
      </p>

      <div className="space-y-3">

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-blue-600" />
          <span>
            {new Date(event.event_date).toLocaleDateString()}
          </span>
        </div>

        {event.event_time && (
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-orange-500" />
            <span>{event.event_time}</span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-red-500" />
            <span>{event.location}</span>
          </div>
        )}

      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Hero */}

        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl text-white p-8 shadow-xl mb-8">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <PartyPopper size={42} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Society Events
              </h1>

              <p className="opacity-90 mt-2">
                Stay updated with all upcoming community events.
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">

          <TableHeader
            title="Browse Events"
            subtitle="Search upcoming and previous events"
          />

          <div className="mt-5">
            <TableSearch
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
            />
          </div>

        </div>

        {loading ? (
          <div className="text-center py-20 text-xl">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <TableEmpty message="No events available." />
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                Upcoming Events
              </h2>

              {upcomingEvents.length === 0 ? (
                <TableEmpty message="No upcoming events." />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      upcoming
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                Past Events
              </h2>

              {pastEvents.length === 0 ? (
                <TableEmpty message="No past events." />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Events;