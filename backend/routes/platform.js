const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Flat = require("../models/Flat");
const Maintenance = require("../models/Maintenance");
const Notice = require("../models/Notice");
const Complaint = require("../models/Complaint");
const Contact = require("../models/Contact");
const Notification = require("../models/Notification");
const { signToken, requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const priorityRank = { urgent: 4, high: 3, normal: 2, low: 1 };
const sanitizeUser = user => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  residentType: user.residentType,
  birthday: user.birthday,
  anniversary: user.anniversary,
  flat: user.flat,
});
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createNotification = payload => Notification.create(payload).catch(error => console.error("Notification error", error));

router.post("/auth/request-otp", asyncRoute(async (req, res) => {
  const { phone, email } = req.body;
  const identifier = (phone || email || "").trim().toLowerCase();
  if (!identifier) return res.status(400).json({ message: "Phone or email is required" });

  const code = makeOtp();
  const codeHash = await bcrypt.hash(code, 10);
  await Otp.create({ identifier, codeHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

  res.status(201).json({
    message: "OTP generated. Connect an SMS/email provider in production to deliver this code.",
    ...(process.env.NODE_ENV !== "production" ? { otp: code } : {}),
  });
}));

router.post("/auth/register", asyncRoute(async (req, res) => {
  const { name, email, phone, password, otp, flatNumber, residentType, birthday, anniversary } = req.body;
  if (!name || !phone || !password || !otp || !flatNumber) {
    return res.status(400).json({ message: "Name, phone, password, OTP, and flat number are required" });
  }

  const identifier = phone.trim().toLowerCase();
  const otpRecord = await Otp.findOne({ identifier, consumed: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!otpRecord || !(await bcrypt.compare(otp, otpRecord.codeHash))) {
    if (otpRecord) await Otp.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const flat = await Flat.findOne({ flatNumber: flatNumber.trim() });
  if (!flat) return res.status(404).json({ message: "Flat must be created by admin before registration" });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email || undefined,
    phone,
    password: hash,
    role: "resident",
    status: "pending_approval",
    flat: flat._id,
    residentType: residentType || "owner",
    birthday,
    anniversary,
  });

  await Otp.findByIdAndUpdate(otpRecord._id, { consumed: true });
  await Flat.findByIdAndUpdate(flat._id, { $addToSet: { residents: user._id } });
  res.status(201).json({ message: "Registration submitted. Admin approval is required before login.", user: sanitizeUser(user) });
}));

router.post("/auth/login", asyncRoute(async (req, res) => {
  const { identifier, phone, email, password } = req.body;
  const loginId = (identifier || phone || email || "").trim().toLowerCase();
  const user = await User.findOne({ $or: [{ phone: loginId }, { email: loginId }] }).populate("flat");
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid credentials" });
  if (user.status !== "active") return res.status(403).json({ message: `Account is ${user.status}. Admin approval is required.` });
  res.json({ token: signToken(user), user: sanitizeUser(user) });
}));

router.get("/auth/me", requireAuth, (req, res) => res.json({ user: sanitizeUser(req.user) }));

router.get("/admin/dashboard", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const [totalFlats, pendingMaintenance, complaintGroups, recentNotices, pendingApprovals] = await Promise.all([
    Flat.countDocuments(),
    Maintenance.aggregate([{ $match: { status: "unpaid" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Notice.find().sort({ createdAt: -1 }).limit(5).populate("createdBy", "name"),
    User.countDocuments({ status: "pending_approval" }),
  ]);
  res.json({
    totalFlats,
    pendingMaintenance: pendingMaintenance[0] || { total: 0, count: 0 },
    complaints: complaintGroups.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    recentNotices,
    pendingApprovals,
  });
}));

router.get("/admin/pending-users", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const users = await User.find({ status: "pending_approval" }).populate("flat").sort({ createdAt: -1 });
  res.json(users.map(sanitizeUser));
}));

router.patch("/admin/users/:id/approve", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: "active", approvedBy: req.user._id, approvedAt: new Date() }, { new: true }).populate("flat");
  if (!user) return res.status(404).json({ message: "User not found" });
  await createNotification({ user: user._id, flat: user.flat?._id, type: "system", title: "Account approved", message: "Your Diamond Square account is now active." });
  res.json({ message: "User approved", user: sanitizeUser(user) });
}));

router.get("/flats", requireAuth, asyncRoute(async (req, res) => {
  if (req.user.role !== "admin") return res.json(req.user.flat ? [req.user.flat] : []);
  res.json(await Flat.find().populate("residents", "name phone email role status residentType birthday anniversary").sort({ flatNumber: 1 }));
}));

router.post("/flats", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const flat = await Flat.create(req.body);
  res.status(201).json(flat);
}));

router.patch("/flats/:id", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!flat) return res.status(404).json({ message: "Flat not found" });
  res.json(flat);
}));

router.post("/maintenance/generate", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { month, dueDate } = req.body;
  if (!month || !dueDate) return res.status(400).json({ message: "Month and due date are required" });
  const flats = await Flat.find();
  const ops = flats.map(flat => ({
    updateOne: {
      filter: { flat: flat._id, month },
      update: { $setOnInsert: { flat: flat._id, month, dueDate, amount: flat.maintenanceAmount, status: "unpaid" } },
      upsert: true,
    },
  }));
  if (ops.length) await Maintenance.bulkWrite(ops);
  const generated = await Maintenance.find({ month }).populate("flat").sort({ dueDate: 1 });
  generated.forEach(item => createNotification({ flat: item.flat._id, type: "maintenance", title: "Maintenance due", message: `${month} maintenance of ₹${item.amount} is due by ${new Date(item.dueDate).toLocaleDateString()}.` }));
  res.status(201).json(generated);
}));

router.get("/maintenance", requireAuth, asyncRoute(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { flat: req.user.flat?._id };
  res.json(await Maintenance.find(filter).populate("flat").sort({ dueDate: -1 }));
}));

router.patch("/maintenance/:id/mark-paid", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const item = await Maintenance.findByIdAndUpdate(req.params.id, { status: "paid", paidAt: new Date(), markedBy: req.user._id, note: req.body.note }, { new: true }).populate("flat");
  if (!item) return res.status(404).json({ message: "Maintenance entry not found" });
  await createNotification({ flat: item.flat._id, type: "maintenance", title: "Payment updated", message: `${item.month} maintenance marked as paid.` });
  res.json(item);
}));

router.post("/notices", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
  await createNotification({ type: "notice", title: "New notice", message: notice.title });
  res.status(201).json(notice);
}));

router.get("/notices", requireAuth, asyncRoute(async (req, res) => {
  const notices = await Notice.find().populate("createdBy", "name").sort({ createdAt: -1 });
  notices.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority] || b.createdAt - a.createdAt);
  res.json(notices);
}));

router.post("/complaints", requireAuth, asyncRoute(async (req, res) => {
  if (!req.user.flat) return res.status(400).json({ message: "User must be linked to a flat" });
  const complaint = await Complaint.create({ ...req.body, resident: req.user._id, flat: req.user.flat._id, statusHistory: [{ status: "open", updatedBy: req.user._id }] });
  res.status(201).json(complaint);
}));

router.get("/complaints", requireAuth, asyncRoute(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { resident: req.user._id };
  res.json(await Complaint.find(filter).populate("resident", "name phone").populate("flat", "flatNumber").sort({ createdAt: -1 }));
}));

router.patch("/complaints/:id/status", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { status } = req.body;
  if (!["open", "in_progress", "resolved"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status, $push: { statusHistory: { status, updatedBy: req.user._id } } }, { new: true }).populate("resident flat");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  await createNotification({ user: complaint.resident._id, flat: complaint.flat._id, type: "complaint", title: "Complaint updated", message: `${complaint.title} is now ${status.replace("_", " ")}.` });
  res.json(complaint);
}));

router.get("/contacts", requireAuth, asyncRoute(async (req, res) => {
  const search = req.query.search ? new RegExp(req.query.search, "i") : null;
  const filter = { active: true, ...(search ? { $or: [{ name: search }, { category: search }, { phone: search }, { notes: search }] } : {}) };
  res.json(await Contact.find(filter).sort({ category: 1, name: 1 }));
}));

router.post("/contacts", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const contact = await Contact.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(contact);
}));

router.patch("/contacts/:id", requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
}));

router.get("/notifications", requireAuth, asyncRoute(async (req, res) => {
  const today = new Date();
  const day = today.getUTCDate();
  const month = today.getUTCMonth() + 1;
  const flatIds = req.user.role === "admin" ? (await Flat.find({}, "_id")).map(f => f._id) : [req.user.flat?._id].filter(Boolean);
  const [stored, birthdays, anniversaries] = await Promise.all([
    Notification.find({ $or: [{ user: req.user._id }, { flat: { $in: flatIds } }, { user: null, flat: null }] }).sort({ createdAt: -1 }).limit(50),
    Flat.find({ _id: { $in: flatIds }, birthday: { $type: "date" }, $expr: { $and: [{ $eq: [{ $dayOfMonth: "$birthday" }, day] }, { $eq: [{ $month: "$birthday" }, month] }] } }, "flatNumber ownerName tenantName birthday"),
    Flat.find({ _id: { $in: flatIds }, anniversary: { $type: "date" }, $expr: { $and: [{ $eq: [{ $dayOfMonth: "$anniversary" }, day] }, { $eq: [{ $month: "$anniversary" }, month] }] } }, "flatNumber ownerName anniversary"),
  ]);
  res.json([
    ...birthdays.map(f => ({ _id: `birthday-${f._id}`, type: "birthday", title: "Birthday reminder", message: `Wish ${f.ownerName || f.tenantName || `Flat ${f.flatNumber}`} a happy birthday today.`, createdAt: today })),
    ...anniversaries.map(f => ({ _id: `anniversary-${f._id}`, type: "anniversary", title: "Anniversary reminder", message: `Anniversary reminder for Flat ${f.flatNumber}.`, createdAt: today })),
    ...stored,
  ]);
}));

module.exports = router;
