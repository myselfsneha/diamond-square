import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            My Profile
          </h1>

          <div className="space-y-4">
            <div>
              <label className="font-semibold">
                Name
              </label>
              <p>{user.name || "N/A"}</p>
            </div>

            <div>
              <label className="font-semibold">
                Phone
              </label>
              <p>{user.phone || "N/A"}</p>
            </div>

            <div>
              <label className="font-semibold">
                Email
              </label>
              <p>{user.email || "N/A"}</p>
            </div>

            <div>
              <label className="font-semibold">
                Role
              </label>
              <p>{user.role || "Resident"}</p>
            </div>

            <div>
              <label className="font-semibold">
                Flat Number
              </label>
              <p>{user.flat_number || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;