import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

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
      // localStorage.setItem('authCookie', response.headers['set-cookie']);
      return response; // Trả về response.data thay vì toàn bộ response
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      throw error; // Ném lại lỗi để xử lý ở trong hàm handleSubmit
    }
  }