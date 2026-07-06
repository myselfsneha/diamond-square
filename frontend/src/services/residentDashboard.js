import api from "./api";

export const getResidentDashboard = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};