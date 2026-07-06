import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/events", {
        title,
        date,
        description,
      });

      setEvents([...events, res.data]);

      setTitle("");
      setDate("");
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

      setEvents(events.filter((event) => event.id !== id));

      alert("Event deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete event");
    }
  };

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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
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
          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No events found.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {event.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  Date: {event.date}
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