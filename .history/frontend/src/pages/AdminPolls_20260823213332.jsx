import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

const EMPTY_FORM = {
  question: "",
  option1: "",
  option2: "",
};

const ITEMS_PER_PAGE = 10;

function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState(EMPTY_FORM);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/polls");

      const data = Array.isArray(res.data?.polls)
        ? res.data.polls
        : Array.isArray(res.data)
        ? res.data
        : [];

      data.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );

      setPolls(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load polls.");
      setPolls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();

    const interval = setInterval(fetchPolls, 10000);

    return () => clearInterval(interval);
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
      setSaving(true);

      const res = await api.post("/polls", form);

      const created =
        res.data.poll || res.data;

      setPolls((prev) => [
        created,
        ...prev,
      ]);

      setForm(EMPTY_FORM);

      toast.success("Poll created.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create poll."
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePoll = async (id) => {
    if (!window.confirm("Delete this poll?"))
      return;

    try {
      await api.delete(`/polls/${id}`);

      setPolls((prev) =>
        prev.filter((poll) => poll.id !== id)
      );

      toast.success("Poll deleted.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const filteredPolls = useMemo(() => {
    return polls.filter((poll) =>
      `${poll.question} ${poll.option1} ${poll.option2}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [polls, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(
    filteredPolls.length / ITEMS_PER_PAGE
  );

  const paginatedPolls = filteredPolls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      key: "question",
      label: "Question",
      render: (poll) => (
        <div className="font-semibold">
          {poll.question}
        </div>
      ),
    },
    {
      key: "options",
      label: "Options",
      render: (poll) => (
        <div className="space-y-2">
          <div>
            {poll.option1} ({poll.option1_votes || 0})
          </div>
          <div>
            {poll.option2} ({poll.option2_votes || 0})
          </div>
        </div>
      ),
    },
        {
      key: "votes",
      label: "Total Votes",
      render: (poll) => poll.total_votes || 0,
    },
    {
      key: "status",
      label: "Status",
      render: (poll) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            poll.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {poll.is_active ? "Active" : "Closed"}
        </span>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (poll) =>
        poll.created_at
          ? new Date(poll.created_at).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (poll) => (
        <button
          onClick={() => deletePoll(poll.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Poll Management"
          subtitle={`Total Polls: ${filteredPolls.length}`}
          buttonText="Refresh"
          onButtonClick={fetchPolls}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-5">
            Create Poll
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
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
            >
              {saving ? "Creating..." : "Create Poll"}
            </button>
          </form>
        </div>

        <TableSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search polls..."
        />

        {loading ? (
          