import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await api.get("/maintenance");
      setMaintenance(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setMaintenance([]);
    }
  };

  const filteredMaintenance = useMemo(() => {
    return maintenance.filter((item) =>
      `${item.month || ""} ${item.amount || ""} ${item.status || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [maintenance, search]);

  const totalPages = Math.ceil(filteredMaintenance.length / rowsPerPage);

  const currentMaintenance = filteredMaintenance.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "month",
      label: "Month",
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => `₹${item.amount}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`font-semibold ${
            item.status === "Paid"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Maintenance Records"
          subtitle={`Total Records: ${filteredMaintenance.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search maintenance..."
          />
        </div>

        {filteredMaintenance.length === 0 ? (
          <TableEmpty message="No maintenance records found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentMaintenance}
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

export default Maintenance;