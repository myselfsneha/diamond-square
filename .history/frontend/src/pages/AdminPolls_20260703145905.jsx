import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminPolls() {
  const [polls, setPolls] = useState([]);

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
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
};

  const createPoll = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/polls", {
        question,
        option1,
        option2,
      });

      setPolls((prev) => [res.data, ...prev]);

      setQuestion("");
      setOption1("");
      setOption2("");

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
    <div className="min-h-screen bg-gray-100">
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
              placeholder="Poll Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              placeholder="Option 1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              placeholder="Option 2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
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

          {polls.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No polls available.
            </div>

          ) : (

            polls.map((poll) => (

              <div
                key={poll.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex justify-between items-start">

                  <div className="flex-1">

                    <h2 className="text-xl font-bold">
                      {poll.question}
                    </h2>

                    <div className="mt-4 space-y-3">

                      <div className="flex justify-between border rounded-lg p-3">
                        <span>{poll.option1}</span>
                        <span className="font-semibold">
                          {poll.option1_votes ?? 0} votes
                        </span>
                      </div>

                      <div className="flex justify-between border rounded-lg p-3">
                        <span>{poll.option2}</span>
                        <span className="font-semibold">
                          {poll.option2_votes ?? 0} votes
                        </span>
                      </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                      Total Votes: {poll.total_votes ?? 0}
                    </p>

                  </div>

                  <div className="ml-6">

                    <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">

                      <p>
                        <span className="font-semibold">
                          Created:
                        </span>{" "}
                        {new Date(
                          poll.created_at
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Status:
                        </span>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            poll.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {poll.is_active
                            ? "Active"
                            : "Closed"}
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => deletePoll(poll.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Delete Poll
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminPolls;