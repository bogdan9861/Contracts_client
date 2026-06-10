import { api } from "..";

export const login = async (data) => {
  return await api.post("/users/login", data);
};

export const register = async (data) => {
  return await api.post("/users/register", data);
};

export const getCurrent = async () => {
  return await api.get("/users/");
};

export const editUser = async ({ companyName, fullName, email }) => {
  return await api.put("/users/", { companyName, fullName, email });
};

export const getAllUsers = async () => {
  return await api.get(`/users/all`);
};

export const removeUser = async (id) => {
  return await api.delete(`/users/${id}`);
};
