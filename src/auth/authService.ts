import api from '../api/api';

export async function login(username: string, password: string): Promise<string> {
  try {
    const response = await api.post('/auth/login', { userName: username, password });
    const token = response.data.token; // Assuming the token is returned in the response
    localStorage.setItem('token', token); // Store the token in localStorage
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}