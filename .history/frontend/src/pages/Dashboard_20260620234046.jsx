function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Diamond Square Dashboard</h1>

      <hr />

      <h3>Welcome</h3>

      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>

    <button onClick={logout}>
  Logout
</button>
  );
}

export default Dashboard;