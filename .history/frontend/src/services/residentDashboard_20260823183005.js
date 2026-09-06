import api from "./api";

export const getResidentDashboard = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const refreshResidentDashboard = async () => {
  const { data } = await api.get("/dashboard?refresh=true");
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const getDashboardActivities = async () => {
  const { data } = await api.get("/dashboard/activities");
  return data;
};

export const getDashboardNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const getUpcomingEvents = async () => {
  const { data } = await api.get("/events/upcoming");
  return data;
};

export const getRecentNotices = async () => {
  const { data } = await api.get("/notices/recent");
  return data;
};

export const getPendingMaintenance = async () => {
  const { data } = await api.get("/maintenance/pending");
  return data;
};

export const getComplaintSummary = async () => {
  const { data } = await api.get("/complaints/summary");
  return data;
};

export const getVisitorSummary = async () => {
  const { data } = await api.get("/visitors/summary");
  return data;
};

export const getPaymentSummary = async () => {
  const { data } = await api.get("/payments/summary");
  return data;
};

export const getPollSummary = async () => {
  const { data } = await api.get("/polls/summary");
  return data;
};

export const getQuickLinks = async () => {
  const { data } = await api.get("/dashboard/quick-links");
  return data;
};