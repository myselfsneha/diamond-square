import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">Loading polls...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Resident Polls & Voting
        </h1>

        <div className="grid gap-4">
          {polls.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No active polls available.
            </div>
          ) : (
            polls.map((poll) => {
              const totalVotes =
                (poll.votes_option1 || 0) +
                (poll.votes_option2 || 0);

              const option1Percent =
                totalVotes === 0
                  ? 0
                  : (
                      (poll.votes_option1 / totalVotes) *
                      100
                    ).toFixed(1);

              const option2Percent =
                totalVotes === 0
                  ? 0
                  : (
                      (poll.votes_option2 / totalVotes) *
                      100
                    ).toFixed(1);

              return (
                <div
                  key={poll.id}
                  className="bg-white rounded-xl shadow p-5"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    {poll.question}
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        votePoll(
                          poll.id,
                          "option1"
                        )
                      }
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Vote: {poll.option1}
                    </button>

                    <button
                      onClick={() =>
                        votePoll(
                          poll.id,
                          "option2"
                        )
                      }
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Vote: {poll.option2}
                    </button>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">
                      Results
                    </h3>

                    <p>
                      {poll.option1}:{" "}
                      {poll.votes_option1 || 0} votes (
                      {option1Percent}%)
                    </p>

                    <p>
                      {poll.option2}:{" "}
                      {poll.votes_option2 || 0} votes (
                      {option2Percent}%)
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Total Votes: {totalVotes}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Polls;