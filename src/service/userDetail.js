import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export async function getUserById(userId) {
    const response = await axios.get(`${API_URL}/get_user/${userId}`, 
    {
        headers: {
            'Content-Type': 'application/json',
          },
        withCredentials: true
    })
    return response

}