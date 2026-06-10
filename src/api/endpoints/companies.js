import { api } from "..";

export const getCompanies = async () => {
  return api.get(`/companies`);
};

export const getCompanyById = async (id) => {
  return api.get(`/companies/${id}`);
};
