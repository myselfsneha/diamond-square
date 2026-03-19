import Layout from "../components/Layout";

function Dashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Complaints</h2>
          <p className="text-2xl mt-2">5</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Notices</h2>
          <p className="text-2xl mt-2">3</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Maintenance</h2>
          <p className="text-2xl mt-2">₹2000</p>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;