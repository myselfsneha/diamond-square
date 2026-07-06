import Navbar from "../components/Navbar";

function AdminSettings() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold dark:text-white">
          Admin Settings
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="font-bold mb-2 dark:text-white">
              Society Name
            </h2>
            <input
              className="w-full border rounded-lg p-3 dark:bg-gray-700"
              defaultValue="Diamond Square"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="font-bold mb-2 dark:text-white">
              Contact Email
            </h2>
            <input
              className="w-full border rounded-lg p-3 dark:bg-gray-700"
              defaultValue="admin@diamondsquare.com"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="font-bold mb-2 dark:text-white">
              Maintenance Cycle
            </h2>
            <select className="w-full border rounded-lg p-3 dark:bg-gray-700">
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;