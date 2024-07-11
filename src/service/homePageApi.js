import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';


export async function fetchAllNotebooks() {
  const sessionJSON = localStorage.getItem('session');
  const session = JSON.parse(sessionJSON);


  const response = await axios.get(`${API_URL}/notebooks`, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  return response.data;
}

export async function createNotebook() {

  const response = await axios.post(`${API_URL}/notebooks/new?title=${'Untitled notebook'}`, {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true

  });
  return response;
}

export async function deleteNotebook(notebookId) {
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/delete`, {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true

  });
  return response;
}

export async function updateNotebook(notebookId, updatedName) {
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/rename?new_title=${updatedName}`, {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true

  });
  return response;
} 

export async function Logout() {
  const response = await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true

  });
  return response;
} 