import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  RefreshCw,
  Trash2,
  Vote,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

const EMPTY_FORM = {
  question: "",
  option1: "",
  option2: "",
};

const ROWS_PER_PAGE = 6;

function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/polls");

      const data = Array.isArray(res.data.polls)
        ? res.data.polls
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

      setPolls((prev) => [
        res.data,
        ...prev,
      ]);

      setForm(EMPTY_FORM);

      toast.success("Poll created successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create poll."
      );
    }
  };

  const deletePoll = async (id) => {
    if (!window.confirm("Delete this poll?")) return;

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
          "Failed to delete poll."
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolls.length / ROWS_PER_PAGE)
  );

  const currentPolls = filteredPolls.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const renderPolls = () => {
    if (loading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          Loading polls...
        </div>
      );
    }

    if (currentPolls.length === 0) {
      return <TableEmpty message="No polls available." />;
    }

    return (
      <>
        <div className="space-y-5">
          {currentPolls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-5 dark:text-white">
                    {poll.question}
                  </h2>

                  {[
                    { key: "option1", label: poll.option1, votes: poll.option1_votes },
                    { key: "option2", label: poll.option2, votes: poll.option2_votes },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className="flex justify-between items-center border rounded-xl px-4 py-3 mb-3 dark:border-gray-700"
                    >
                      <span>{option.label}</span>
                      <span className="flex items-center gap-2 font-semibold text-blue-600">
                        <Vote size={16} />
                        {option.votes ?? 0}
                      </span>
                    </div>
                  ))}

                  <p className="mt-4 text-gray-500">
                    Total Votes: {poll.total_votes ?? 0}
                  </p>
                </div>

                <div className="lg:w-64">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                    <p className="text-sm">
                      <strong>Created:</strong><br />
                      {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm"><strong>Status:</strong></p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${poll.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {poll.is_active ? "Active" : "Closed"}
                    </span>
                    <button
                      onClick={() => deletePoll(poll.id)}
                      className="mt-5 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                      Delete Poll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </>
    );
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <TableHeader
          title="Admin Polls & Voting"
          subtitle={`Total Polls: ${filteredPolls.length}`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">

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
              className="w-full border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <input
              type="text"
              name="option1"
              placeholder="Option 1"
              value={form.option1}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <input
              type="text"
              name="option2"
              placeholder="Option 2"
              value={form.option2}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                <Plus size={18} />
                Create Poll
              </button>

              <button
                type="button"
                onClick={fetchPolls}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search polls..."
          />
        </div>

        {false ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            Loading polls...
          </div>
        ) : currentPolls.length === 0 ? (
          <TableEmpty message="No polls available." />
        ) : (
          <>
            <div className="space-y-5">
              {currentPolls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-5 dark:text-white">
                        {poll.question}
                      </h2>

                      {[
                        {
                          label: poll.option1,
                          votes: poll.option1_votes,
                        },
                        {
                          label: poll.option2,
                          votes: poll.option2_votes,
                        },
                      ].map((option, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border rounded-xl px-4 py-3 mb-3 dark:border-gray-700"
                        >
                          <span>{option.label}</span>

                          <span className="flex items-center gap-2 font-semibold text-blue-600">
                            <Vote size={16} />
                            {option.votes ?? 0}
                          </span>
                        </div>
                      ))}

                      <p className="mt-4 text-gray-500">
                        Total Votes: {poll.total_votes ?? 0}
                      </p>
                    </div>

                    <div className="lg:w-64">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                        <p className="text-sm">
                          <strong>Created:</strong><br />
                          {new Date(
                            poll.created_at
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-sm">
                          <strong>Status:</strong>
                        </p>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            poll.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {poll.is_active
                            ? "Active"
                            : "Closed"}
                        </span>

                        <button
                          onClick={() =>
                            deletePoll(poll.id)
                          }
                          className="mt-5 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                        >
                          <Trash2 size={18} />
                          Delete Poll
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              onNext={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPolls;