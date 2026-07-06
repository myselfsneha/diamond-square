import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminMaintenance() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

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

    const interval = setInterval(fetchBills, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);

      const res = await api.get("/maintenance");

      setRecords(
        Array.isArray(res.data?.maintenance)
          ? res.data.maintenance
          : []
      );
    } catch (err) {
      console.log(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");

      setUsers(
        Array.isArray(res.data?.residents)
          ? res.data.residents
          : []
      );
    } catch (err) {
      console.log(err);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);

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
  };

  const saveBill = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/maintenance/${editingId}`, form);

        alert("Bill updated successfully");
      } else {
        await api.post("/maintenance", form);

        alert("Maintenance bill created.");
      }

      resetForm();
      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to save bill.");
    }
  };

  const editBill = (bill) => {
    setEditingId(bill.id);

    setForm({
      user_id: bill.user_id,
      month: bill.month,
      year: bill.year,
      maintenance_amount: bill.maintenance_amount,
      water_charges: bill.water_charges,
      other_charges: bill.other_charges,
      due_date: bill.due_date?.split("T")[0] || "",
      remarks: bill.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const markPaid = async (bill) => {
    try {
      await api.put(`/maintenance/pay/${bill.id}`, {
        amount_paid: bill.total_amount,
      });

      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to update payment.");
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await api.delete(`/maintenance/${id}`);

      setRecords((prev) => prev.filter((bill) => bill.id !== id));

      alert("Bill deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  const filteredBills = useMemo(() => {
    return (Array.isArray(records) ? records : []).filter((bill) => {
      const matchesSearch = `${bill.name || ""} ${bill.flat_number || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalBills = Array.isArray(records) ? records.length : 0;

  const paidBills = (Array.isArray(records) ? records : []).filter(
    (r) => r.status === "Paid"
  ).length;

  const pendingBills = (Array.isArray(records) ? records : []).filter(
    (r) => r.status !== "Paid"
  ).length;

  const totalCollection = (Array.isArray(records) ? records : []).reduce(
    (sum, r) => sum + Number(r.amount_paid || 0),
    0
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form
            onSubmit={saveBill}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
            >
              {editingId ? "Update Bill" : "Create Bill"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          Loading...
        </div>
      ) : (
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

                    <p className="text-gray-800 dark:text-white">
                      Flat: {bill.flat_number}
                    </p>

                    <p className="text-gray-800 dark:text-white">
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
                  <div className="mt-4 text-gray-800 dark:text-white">
                    <strong>Remarks:</strong> {bill.remarks}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => editBill(bill)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>

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
      )}
    </div>
  </div>
);

}

export default AdminMaintenance;