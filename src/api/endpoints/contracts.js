import { api } from "..";

export const createContract = async (data) => {
  return await api.post("/contracts/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editContract = async ({
  number,
  date,
  sum,
  contractId,
  clientId,
}) => {
  return await api.put(`/contracts/${contractId}`, {
    number,
    date,
    sum,
    clientId,
  });
};

export const getContracts = async () => {
  return await api.get("/contracts");
};
