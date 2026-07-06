import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminMaintenance() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState({
    user_id: "",
    month: "",
    year: new Date().getFullYear(),
    maintenance_amount: "",
    water_charges: "",
    other_charges: "",
    due_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchBills();
    fetchResidents();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createBill = async (e) => {
    e.preventDefault();

    try {
      await api.post("/maintenance", form);

      alert("Maintenance bill created.");

      setForm({
        user_id: "",
        month: "",
        year: new Date().getFullYear(),
        maintenance_amount: "",
        water_charges: "",
        other_charges: "",
        due_date: "",
        remarks: "",
      });

      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to create bill");
    }
  };

  const markPaid = async (bill) => {
    try {
      await api.put(`/maintenance/pay/${bill.id}`, {
        amount_paid: bill.total_amount,
      });

      fetchBills();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await api.delete(`/maintenance/${id}`);
      fetchBills();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredBills = useMemo(() => {
    return records.filter((bill) => {
      const matchesSearch = `${bill.name || ""} ${bill.flat_number || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        bill.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalBills = records.length;

  const paidBills = records.filter(
    (r) => r.status === "Paid"
  ).length;

  const pendingBills = records.filter(
    (r) => r.status !== "Paid"
  ).length;

  const totalCollection = records.reduce(
    (sum, r) => sum + Number(r.amount_paid || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Maintenance Billing
        </h1>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-gray-500">Total Bills</h2>
            <p className="text-3xl font-bold mt-2">
              {totalBills}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-gray-500">Paid Bills</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {paidBills}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-gray-500">Pending Bills</h2>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {pendingBills}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-gray-500">Collection</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ₹{totalCollection}
            </p>
          </div>

        </div>

        {/* Search + Filter */}

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search resident or flat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Partially Paid</option>
              <option>Paid</option>
            </select>

          </div>

        </div>

        {/* Create Bill */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-5">
            Create Maintenance Bill
          </h2>

          <form
            onSubmit={createBill}
            className="grid md:grid-cols-3 gap-4"
          >
                        <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            >
              <option value="">
                Select Resident
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name} ({user.flat_number})
                </option>
              ))}
            </select>

            <input
              type="text"
              name="month"
              placeholder="Month"
              value={form.month}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="maintenance_amount"
              placeholder="Maintenance Amount"
              value={form.maintenance_amount}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="water_charges"
              placeholder="Water Charges"
              value={form.water_charges}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="number"
              name="other_charges"
              placeholder="Other Charges"
              value={form.other_charges}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 md:col-span-2"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
            >
              Create Bill
            </button>

          </form>

        </div>

        {/* Bills List */}

        <div className="space-y-4">

          {filteredBills.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No maintenance bills found.
            </div>

          ) : (

            filteredBills.map((bill) => (

              <div
                key={bill.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {bill.name}
                    </h2>

                    <p className="text-gray-600">
                      Flat: {bill.flat_number}
                    </p>

                    <p className="text-gray-600">
                      {bill.month} {bill.year}
                    </p>

                  </div>

                  <div className="text-right mt-4 md:mt-0">

                    <p className="font-semibold">
                      Total: ₹{bill.total_amount}
                    </p>

                    <p className="text-green-600">
                      Paid: ₹{bill.amount_paid}
                    </p>

                    <p className="text-red-600">
                      Balance: ₹{bill.balance}
                    </p>

                  </div>

                </div>

                <div className="grid md:grid-cols-4 gap-3 mt-5">

                  <div>
                    <span className="font-semibold">
                      Maintenance:
                    </span>
                    <br />
                    ₹{bill.maintenance_amount}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Water:
                    </span>
                    <br />
                    ₹{bill.water_charges}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Other:
                    </span>
                    <br />
                    ₹{bill.other_charges}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Due Date:
                    </span>
                    <br />
                    {bill.due_date?.split("T")[0]}
                  </div>

                </div>

                                <div className="mt-4">

                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                      bill.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : bill.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bill.status}
                  </span>

                </div>

                {bill.remarks && (

                  <div className="mt-4 text-gray-600">
                    <strong>Remarks:</strong> {bill.remarks}
                  </div>

                )}

                <div className="flex flex-wrap gap-3 mt-6">

                  {bill.status !== "Paid" && (
                    <button
                      onClick={() => markPaid(bill)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                      Mark Paid
                    </button>
                  )}

                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
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

export default AdminMaintenance;