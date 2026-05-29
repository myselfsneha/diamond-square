import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API = process.env.REACT_APP_API_URL || process.env.REACT_APP_API || "http://localhost:5000";
const priorities = ["urgent", "high", "normal", "low"];
const complaintStates = ["open", "in_progress", "resolved"];
const contactCategories = ["electrician", "plumber", "lift_operator", "society_manager", "security", "other"];

async function api(path, options = {}) {
  const token = localStorage.getItem("diamondSquareToken");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const response = await fetch(`${API}/api${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Server is taking too long to respond. Please confirm the backend is running at ${API}.`);
    }
    if (error instanceof TypeError) {
      throw new Error(`Cannot reach the Diamond Square backend at ${API}. Please start the backend or check REACT_APP_API_URL.`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = value => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const label = value => String(value || "").replaceAll("_", " ");

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ identifier: "", phone: "", email: "", password: "", name: "", flatNumber: "", residentType: "owner", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const requestOtp = async () => {
    setMessage("Requesting OTP…");
    setLoading(true);
    try {
      const data = await api("/auth/request-otp", { method: "POST", body: JSON.stringify({ phone: form.phone, email: form.email }) });
      setMessage(data.otp ? `Development OTP: ${data.otp}` : data.message);
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };

  const submit = async event => {
    event.preventDefault();
    setMessage(mode === "login" ? "Signing you in…" : "Submitting registration…");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ identifier: form.identifier, password: form.password }) });
        localStorage.setItem("diamondSquareToken", data.token);
        onAuth(data.user);
      } else {
        const data = await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
        setMessage(data.message);
        setMode("login");
      }
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };

  return <main className="auth-shell">
    <section className="auth-card hero-card">
      <span className="eyebrow">Diamond Square</span>
      <h1>Residential society operations, secured in one cloud app.</h1>
      <p>Real login, admin approval, flat privacy, maintenance dues, notices, complaints, contacts, and reminders for daily society management.</p>
      <div className="hero-grid">
        <div><strong>RBAC</strong><span>Admin + Resident permissions</span></div>
        <div><strong>OTP</strong><span>Verified registration flow</span></div>
        <div><strong>DB</strong><span>No static module data</span></div>
      </div>
    </section>
    <section className="auth-card form-card">
      <div className="tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button></div>
      <form onSubmit={submit}>
        {mode === "login" ? <>
          <label>Phone or email<input value={form.identifier} onChange={e => setField("identifier", e.target.value)} required /></label>
          <label>Password<input type="password" value={form.password} onChange={e => setField("password", e.target.value)} required /></label>
        </> : <>
          <div className="two"><label>Name<input value={form.name} onChange={e => setField("name", e.target.value)} required /></label><label>Flat number<input value={form.flatNumber} onChange={e => setField("flatNumber", e.target.value)} required /></label></div>
          <div className="two"><label>Phone<input value={form.phone} onChange={e => setField("phone", e.target.value)} required /></label><label>Email<input type="email" value={form.email} onChange={e => setField("email", e.target.value)} /></label></div>
          <div className="two"><label>Password<input type="password" value={form.password} onChange={e => setField("password", e.target.value)} required /></label><label>Resident type<select value={form.residentType} onChange={e => setField("residentType", e.target.value)}><option value="owner">Owner</option><option value="tenant">Tenant</option></select></label></div>
          <div className="otp-row"><label>OTP<input value={form.otp} onChange={e => setField("otp", e.target.value)} required /></label><button type="button" className="ghost" onClick={requestOtp} disabled={loading || !form.phone}>Send OTP</button></div>
        </>}
        <button className="primary" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Secure login" : "Submit for approval"}</button>
        {message && <p className="message">{message}</p>}
      </form>
    </section>
  </main>;
}

function Shell({ user, onLogout, children, active, setActive }) {
  const nav = user.role === "admin" ? ["dashboard", "flats", "maintenance", "notices", "complaints", "contacts", "notifications"] : ["home", "maintenance", "notices", "complaints", "contacts", "notifications"];
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span>◆</span><div><strong>Diamond Square</strong><small>{user.role === "admin" ? "Committee Console" : `Flat ${user.flat?.flatNumber || "—"}`}</small></div></div>{nav.map(item => <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>{label(item)}</button>)}<button onClick={onLogout}>Logout</button></aside>
    <div className="workspace"><header><div><span className="eyebrow">{user.role}</span><h2>Welcome, {user.name}</h2></div><div className="pill">{user.status}</div></header>{children}</div>
  </div>;
}

function Stat({ title, value, tone }) { return <article className={`stat ${tone || ""}`}><span>{title}</span><strong>{value}</strong></article>; }
function Empty({ text }) { return <div className="empty">{text}</div>; }

function AdminDashboard({ refreshKey }) {
  const [data, setData] = useState(null);
  useEffect(() => { api("/admin/dashboard").then(setData).catch(console.error); }, [refreshKey]);
  if (!data) return <Empty text="Loading dashboard…" />;
  return <section className="grid-page"><div className="stats"><Stat title="Total flats" value={data.totalFlats} /><Stat title="Pending dues" value={money(data.pendingMaintenance.total)} tone="warn" /><Stat title="Unpaid bills" value={data.pendingMaintenance.count} /><Stat title="Pending approvals" value={data.pendingApprovals} tone="info" /></div><div className="panel"><h3>Complaint status overview</h3><div className="status-grid">{complaintStates.map(state => <Stat key={state} title={label(state)} value={data.complaints[state] || 0} />)}</div></div><div className="panel"><h3>Recent notices</h3>{data.recentNotices.length ? data.recentNotices.map(n => <div className="row" key={n._id}><strong>{n.title}</strong><span>{n.priority}</span></div>) : <Empty text="No notices posted yet." />}</div><div className="panel accent"><h3>Quick actions</h3><p>Use the navigation to add notices, manage flats, generate monthly maintenance, and update complaint workflows.</p></div></section>;
}

function Flats({ user }) {
  const [flats, setFlats] = useState([]); const [pending, setPending] = useState([]); const [form, setForm] = useState({ flatNumber: "", floor: "", maintenanceAmount: 0, ownerName: "", contactNumber: "" });
  const load = useCallback(() => Promise.all([api("/flats"), user.role === "admin" ? api("/admin/pending-users") : Promise.resolve([])]).then(([f, p]) => { setFlats(f); setPending(p); }), [user.role]);
  useEffect(() => { load().catch(console.error); }, [load]);
  const createFlat = async e => { e.preventDefault(); await api("/flats", { method: "POST", body: JSON.stringify(form) }); setForm({ flatNumber: "", floor: "", maintenanceAmount: 0, ownerName: "", contactNumber: "" }); load(); };
  const approve = async id => { await api(`/admin/users/${id}/approve`, { method: "PATCH" }); load(); };
  return <section className="grid-page"><div className="panel"><h3>{user.role === "admin" ? "Flat directory" : "My flat details"}</h3>{flats.length ? flats.map(f => <div className="card-row" key={f._id}><div><strong>Flat {f.flatNumber}</strong><p>{f.ownerName || f.tenantName || "Resident details pending"} · {f.contactNumber || "No contact"}</p><small>Birthday {formatDate(f.birthday)} · Anniversary {formatDate(f.anniversary)}</small></div><span>{money(f.maintenanceAmount)}</span></div>) : <Empty text="No flat records found." />}</div>{user.role === "admin" && <><form className="panel form-grid" onSubmit={createFlat}><h3>Add flat</h3><input placeholder="Flat number" value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })} required /><input placeholder="Floor" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} /><input type="number" placeholder="Maintenance amount" value={form.maintenanceAmount} onChange={e => setForm({ ...form, maintenanceAmount: Number(e.target.value) })} required /><input placeholder="Owner name" value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} /><input placeholder="Contact number" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} /><button className="primary">Create flat</button></form><div className="panel"><h3>Approval queue</h3>{pending.length ? pending.map(p => <div className="row" key={p._id}><span>{p.name} · Flat {p.flat?.flatNumber}</span><button onClick={() => approve(p._id)}>Approve</button></div>) : <Empty text="No residents waiting for approval." />}</div></>}</section>;
}

function Maintenance({ user }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState({ month: new Date().toISOString().slice(0, 7), dueDate: "" });
  const load = useCallback(() => api("/maintenance").then(setItems), []); useEffect(() => { load().catch(console.error); }, [load]);
  const generate = async e => { e.preventDefault(); await api("/maintenance/generate", { method: "POST", body: JSON.stringify(form) }); load(); };
  const markPaid = async id => { await api(`/maintenance/${id}/mark-paid`, { method: "PATCH", body: JSON.stringify({ note: "Updated from admin dashboard" }) }); load(); };
  const pending = items.filter(i => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);
  return <section className="grid-page"><div className="stats"><Stat title="Total records" value={items.length} /><Stat title="Pending amount" value={money(pending)} tone="warn" /></div>{user.role === "admin" && <form className="panel inline-form" onSubmit={generate}><h3>Generate monthly maintenance</h3><input type="month" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required /><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required /><button className="primary">Generate for all flats</button></form>}<div className="panel"><h3>{user.role === "admin" ? "All maintenance dues" : "My dues"}</h3>{items.length ? items.map(item => <div className="card-row" key={item._id}><div><strong>{item.month} · Flat {item.flat?.flatNumber}</strong><p>Due {formatDate(item.dueDate)}</p></div><span className={`badge ${item.status}`}>{item.status}</span><strong>{money(item.amount)}</strong>{user.role === "admin" && item.status === "unpaid" && <button onClick={() => markPaid(item._id)}>Mark paid</button>}</div>) : <Empty text="No maintenance records yet." />}</div></section>;
}

function Notices({ user }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState({ title: "", message: "", priority: "normal" });
  const load = useCallback(() => api("/notices").then(setItems), []); useEffect(() => { load().catch(console.error); }, [load]);
  const submit = async e => { e.preventDefault(); await api("/notices", { method: "POST", body: JSON.stringify(form) }); setForm({ title: "", message: "", priority: "normal" }); load(); };
  return <section className="grid-page">{user.role === "admin" && <form className="panel form-grid" onSubmit={submit}><h3>Post notice</h3><input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>{priorities.map(p => <option key={p}>{p}</option>)}</select><button className="primary">Publish notice</button></form>}<div className="panel"><h3>Notice board</h3>{items.length ? items.map(n => <article className="notice" key={n._id}><div><span className={`priority ${n.priority}`}>{n.priority}</span><small>{formatDate(n.createdAt)}</small></div><h4>{n.title}</h4><p>{n.message}</p></article>) : <Empty text="No notices available." />}</div></section>;
}

function Complaints({ user }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState({ title: "", description: "" });
  const load = useCallback(() => api("/complaints").then(setItems), []); useEffect(() => { load().catch(console.error); }, [load]);
  const submit = async e => { e.preventDefault(); await api("/complaints", { method: "POST", body: JSON.stringify(form) }); setForm({ title: "", description: "" }); load(); };
  const update = async (id, status) => { await api(`/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); load(); };
  return <section className="grid-page">{user.role !== "admin" && <form className="panel form-grid" onSubmit={submit}><h3>Raise complaint</h3><input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><textarea placeholder="Describe the issue" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /><button className="primary">Submit complaint</button></form>}<div className="panel"><h3>{user.role === "admin" ? "All complaints" : "My complaints"}</h3>{items.length ? items.map(c => <div className="complaint" key={c._id}><div><strong>{c.title}</strong><span className={`badge ${c.status}`}>{label(c.status)}</span></div><p>{c.description}</p><small>Flat {c.flat?.flatNumber} · {formatDate(c.createdAt)}</small>{user.role === "admin" && <select value={c.status} onChange={e => update(c._id, e.target.value)}>{complaintStates.map(s => <option key={s} value={s}>{label(s)}</option>)}</select>}</div>) : <Empty text="No complaints found." />}</div></section>;
}

function Contacts({ user }) {
  const [items, setItems] = useState([]); const [search, setSearch] = useState(""); const [form, setForm] = useState({ name: "", category: "electrician", phone: "", notes: "" });
  const load = useCallback(() => api(`/contacts${search ? `?search=${encodeURIComponent(search)}` : ""}`).then(setItems), [search]); useEffect(() => { load().catch(console.error); }, [load]);
  const submit = async e => { e.preventDefault(); await api("/contacts", { method: "POST", body: JSON.stringify(form) }); setForm({ name: "", category: "electrician", phone: "", notes: "" }); load(); };
  return <section className="grid-page"><div className="panel"><h3>Important contacts</h3><input placeholder="Search electrician, plumber, security…" value={search} onChange={e => setSearch(e.target.value)} />{items.length ? items.map(c => <div className="card-row" key={c._id}><div><strong>{c.name}</strong><p>{label(c.category)} · {c.notes}</p></div><a href={`tel:${c.phone}`}>{c.phone}</a></div>) : <Empty text="No contacts saved yet." />}</div>{user.role === "admin" && <form className="panel form-grid" onSubmit={submit}><h3>Add contact</h3><input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{contactCategories.map(c => <option key={c} value={c}>{label(c)}</option>)}</select><input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /><textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /><button className="primary">Save contact</button></form>}</section>;
}

function Notifications() {
  const [items, setItems] = useState([]); useEffect(() => { api("/notifications").then(setItems).catch(console.error); }, []);
  return <section className="panel"><h3>Notifications & reminders</h3>{items.length ? items.map(n => <div className="notification" key={n._id}><span>{label(n.type)}</span><strong>{n.title}</strong><p>{n.message}</p></div>) : <Empty text="No notifications yet. Maintenance, notices, complaints, birthdays and anniversaries will appear here." />}</section>;
}

function App() {
  const [user, setUser] = useState(null); const [active, setActive] = useState("dashboard"); const [refreshKey] = useState(0);
  useEffect(() => { if (localStorage.getItem("diamondSquareToken")) api("/auth/me").then(data => { setUser(data.user); setActive(data.user.role === "admin" ? "dashboard" : "home"); }).catch(() => localStorage.removeItem("diamondSquareToken")); }, []);
  const logout = () => { localStorage.removeItem("diamondSquareToken"); setUser(null); };
  const page = useMemo(() => {
    if (!user) return null;
    if (active === "dashboard") return <AdminDashboard refreshKey={refreshKey} />;
    if (active === "home" || active === "flats") return <Flats user={user} />;
    if (active === "maintenance") return <Maintenance user={user} />;
    if (active === "notices") return <Notices user={user} />;
    if (active === "complaints") return <Complaints user={user} />;
    if (active === "contacts") return <Contacts user={user} />;
    return <Notifications />;
  }, [active, refreshKey, user]);
  if (!user) return <AuthScreen onAuth={u => { setUser(u); setActive(u.role === "admin" ? "dashboard" : "home"); }} />;
  return <Shell user={user} onLogout={logout} active={active} setActive={setActive}>{page}</Shell>;
}

export default App;
