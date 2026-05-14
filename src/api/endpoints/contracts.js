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
