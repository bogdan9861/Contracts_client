import { api } from "..";

export const createClient = async ({
  comapnyName,
  contactPerson,
  email,
  phone,
}) => {
  return await api.post("/clients/", {
    comapnyName,
    contactPerson,
    email,
    phone,
  });
};

export const editClient = async (data) => {
  return await api.put(`/clients/${data?.clientID}`, data);
};

export const getClients = async (search) => {
  return await api.get(`/clients?search=${search || ""}`);
};

export const deleteClient = async (id) => {
  return await api.delete(`/clients/${id}`);
};
