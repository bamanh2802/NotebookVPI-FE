import axios from 'axios';

import API_URL from './apiPath';

axios.defaults.withCredentials = true;

export async function fetchAllNotebooks() {
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

export async function changeUserName(newName) {
  const response = await axios.patch(`${API_URL}/user_change_full_name?new_full_name=${newName}`, {} ,{
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  })
  return response
}
export async function changeUserEmail(newEmail) {
  const response = await axios.post(`${API_URL}/user_change_email?new_email=${newEmail}`, {} ,{
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  })
  return response
}
export async function changeUserPassword(oldPassword, newPassword) {
  const response = await axios.post(`${API_URL}/user_change_password?old_password=${oldPassword}&new_password=${newPassword}`, {} ,{
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  })
  return response
}
export async function whoAmI(){
  const response = await axios.get(`${API_URL}/whoami`, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  })
  return response
}