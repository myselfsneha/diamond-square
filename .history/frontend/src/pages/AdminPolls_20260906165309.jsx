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
  