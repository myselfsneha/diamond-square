import api from "./api";

export const getResidentDashboard = async () => {
  const { data } = await api.get("/dashboard/resident");
  return data;
};

export default {
  getResidentDashboard,
};