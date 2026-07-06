import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);

      const res = await api.get("/resident-polls");

      setPolls(
        Array.isArray(res.data.polls)
          ? res.data.polls
          : []
      );
    } catch (error) {
      console.log(error);
      setPolls([]);
      alert("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  const votePoll = async (pollId, option) => {
    try {
      await api.post(`/resident-polls/${pollId}/vote`, {
        option,
      });

      alert("Vote submitted successfully");
      fetchPolls();
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to submit vote"
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

  const totalPages = Math.ceil(
    filteredPolls.length / rowsPerPage
  );

  const currentPolls = filteredPolls.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "question",
      label: "Question",
    },
    {
      key: "option1",
      label: "Option 1",
      render: (poll) => (
        <button
          onClick={() =>
            votePoll(poll.id, "option1")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
        >
          {poll.option1}
        </button>
      ),
    },
    {
      key: "option2",
      label: "Option 2",
      render: (poll) => (
        <button
          onClick={() =>
            votePoll(poll.id, "option2")
          }
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
        >
          {poll.option2}
        </button>
      ),
    },
    {
      key: "results",
      label: "Results",
      render: (poll) => {
        const total =
          (poll.votes_option1 || 0) +
          (poll.votes_option2 || 0);

        return (
          <div className="text-sm">
            <div>
              {poll.option1}: {poll.votes_option1 || 0}
            </div>
            <div>
              {poll.option2}: {poll.votes_option2 || 0}
            </div>
            <div className="font-semibold">
              Total: {total}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Resident Polls"
          subtitle={`Total Polls: ${filteredPolls.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search polls..."
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6">
            Loading polls...
          </div>
        ) : filteredPolls.length === 0 ? (
          <TableEmpty message="No active polls available." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentPolls}
              rowKey="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Polls;