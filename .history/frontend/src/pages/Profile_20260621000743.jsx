import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            My Profile
          </h1>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name</p>
              <p>{profile.name}</p>
            </div>

            <div>
              <p className="font-semibold">Email</p>
              <p>{profile.email}</p>
            </div>

            <div>
              <p className="font-semibold">Phone</p>
              <p>{profile.phone}</p>
            </div>

            <div>
              <p className="font-semibold">Flat Number</p>
              <p>{profile.flat_number}</p>
            </div>

            <div>
              <p className="font-semibold">Resident Type</p>
              <p>{profile.resident_type}</p>
            </div>

            <div>
              <p className="font-semibold">Birthday</p>
              <p>{profile.birthday}</p>
            </div>

            <div>
              <p className="font-semibold">Anniversary</p>
              <p>{profile.anniversary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;