import { api } from "..";

export const createContract = async (data) => {
  return await api.post("/contracts/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editContract = async (id, data) => {
  return await api.put(`/contracts/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getContracts = async () => {
  return await api.get("/contracts");
};

export const getMyContracts = async () => {
  return await api.get("/contracts/my");
};

export const getCompanyClients = async (params) => {
  return await api.get(`/clients/company-clients`);
};

export const getNotifications = async () => {
  return api.get(`/notifications`);
};

export const markAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const getPendingRequests = async () => {
  return api.get(`/contracts/pending`);
};

export const approveContract = async (contractId) => {
  return api.patch(`/contracts/${contractId}/approve`);
};

export const rejectContract = async (contractId, data) => {
  return api.patch(`/contracts/${contractId}/reject`, data);
};

export const createContractRequest = async (data) => {
  return api.post(`/contracts/create-request`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
