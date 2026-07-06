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
        <h2 style={{ padding: "20px" }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>My Profile</h1>

        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phone}</p>
        <p>Flat Number: {profile.flat_number}</p>
        <p>Resident Type: {profile.resident_type}</p>
        <p>Birthday: {profile.birthday}</p>
        <p>Anniversary: {profile.anniversary}</p>
      </div>
    </div>
  );
}

export default Profile;