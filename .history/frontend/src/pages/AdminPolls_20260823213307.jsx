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
    