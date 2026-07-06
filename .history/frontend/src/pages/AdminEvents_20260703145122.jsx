import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

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

  const eventList = Array.isArray(events) ? events : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Events Management
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form onSubmit={addEvent}>
            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Event Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />

              <textarea
                placeholder="Event Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-lg px-4 py-2"
                rows="4"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Event
              </button>

            </div>
          </form>
        </div>
                <div className="grid gap-4">
          {eventList.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5 text-center text-gray-500">
              No events found.
            </div>
          ) : (
            eventList.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {event.title}
                </h2>

                <p className="text-gray-800 dark:text-white mt-2">
                  Date:{" "}
                  {event.event_date
                    ? new Date(event.event_date).toLocaleDateString()
                    : "N/A"}
                </p>

                <p className="text-gray-800 dark:text-white">
                  Location: {event.location || "N/A"}
                </p>

                <p className="text-gray-700 mt-2">
                  {event.description}
                </p>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminEvents;