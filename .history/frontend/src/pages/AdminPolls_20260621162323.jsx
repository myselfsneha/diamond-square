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
      setPolls(res.data);
    } catch (error) {
      console.log(error);
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

      setPolls([res.data, ...polls]);

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

      setPolls(
        polls.filter((poll) => poll.id !== id)
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
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Polls & Voting
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form onSubmit={createPoll}>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Poll Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Option 1"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Option 2"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          {polls.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No polls available.
            </div>
          ) : (
            polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {poll.question}
                </h2>

                <div className="mt-3 space-y-2">
                  <p>• {poll.option1}</p>
                  <p>• {poll.option2}</p>
                </div>

                <button
                  onClick={() => deletePoll(poll.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Poll
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPolls;