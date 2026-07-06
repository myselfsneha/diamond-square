import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Link } from "react-router-dom";

function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/complaints", form);

      alert("Complaint submitted successfully!");

      navigate("/complaints");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            Create Complaint
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Complaint Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter complaint title"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-blue-600">
    My Complaints
  </h1>

  <Link
    to="/create-complaint"
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    + New Complaint
  </Link>
</div>
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your issue"
                rows="5"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateComplaint;