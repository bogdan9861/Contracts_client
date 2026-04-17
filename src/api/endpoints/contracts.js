import { api } from "..";

export const createContract = async (data) => {
  return await api.post("/contracts/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editContract = async (data) => {
  return await api.put(`/contracts/${data?.contractId}`, data);
};

export const getContracts = async () => {
  return await api.get("/contracts");
};
