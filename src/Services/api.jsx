import axios from "axios";
const API_URL = "https://6958b2e96c3282d9f1d591fb.mockapi.io/api/hms/";
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});
export const getPatients = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};
export default api;
