import axios from 'axios';
import API_URL from './apiPath';


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