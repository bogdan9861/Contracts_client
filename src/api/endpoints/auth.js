import { api } from "..";

export const login = async (data) => {
  return await api.post("/users/login", data);
};

export const register = async ({ companyName, fullName, email, password }) => {
  return await api.post("/users/register", {
    companyName,
    fullName,
    email,
    password,
  });
};

export const getCurrent = async () => {
  return await api.get("/users/");
};

export const editUser = async ({ companyName, fullName, email }) => {
  return await api.put("/users/", { companyName, fullName, email });
};
