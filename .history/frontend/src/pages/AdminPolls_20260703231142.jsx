// Part 1/3

import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const EMPTY_FORM = {
  question: "",
  option1: "",
  option2: "",
};

function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchPolls = useCallback(async () => {
    try {
      const res = await api.get("/polls");

      setPolls(
        Array.isArray(res.data.polls)
          ? res.data.polls
          : []
      );
    } catch (error) {
      console.log(error);
      setPolls([]);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPoll = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/polls", form);

      setPolls((prev) => [res.data, ...prev]);

      setForm(EMPTY_FORM);

      alert("Poll created successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to create poll");
    }
  };

  const deletePoll = async (id) => {
    if (!window.confirm("Delete this poll?")) return;

    try {
      await api.delete(`/polls/${id}`);

      setPolls((prev) =>
        prev.filter((poll) => poll.id !== id)
      );

      alert("Poll deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete poll");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Admin Polls & Voting
          </h1>

          <button
            onClick={fetchPolls}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-5">
            Create New Poll
          </h2>

          <form
            onSubmit={createPoll}
            className="space-y-4"
          >
            <input
              type="text"
              name="question"
              placeholder="Poll Question"
              value={form.question}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="option1"
              placeholder="Option 1"
              value={form.option1}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="option2"
              placeholder="Option 2"
              value={form.option2}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create Poll
            </button>
          </form>
        </div>

        <div className="space-y-4">
          