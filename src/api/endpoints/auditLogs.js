import { api } from "..";

export const getAuditLogs = async () => {
  return await api.get("/logs");
};

