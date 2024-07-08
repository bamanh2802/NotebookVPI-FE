import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function fetchAllNotebooks() {
  const response = await axios.get(`${API_URL}/get-all-notebook`);
  return response.data;
}

export async function deleteNotebook(id) {
  const response = await axios.delete(`${API_URL}/delete-notebook/${id}`);
  return response.data;
}

export async function updateNotebook(id, updatedData) {
  const response = await axios.put(`${API_URL}/update-notebook/${id}`, updatedData);
  return response.data;
}