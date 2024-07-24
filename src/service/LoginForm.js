import axios from 'axios';

import API_URL from './apiPath';


export async function loginForm(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      throw error; 
    }
  }

export async function resetPassword(userEmail) {
    const response = await axios.get(`${API_URL}/reset_password?email=${userEmail}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  return response
}
