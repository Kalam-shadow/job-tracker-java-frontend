import api from '../api/api';
// import { useNavigate } from 'react-router-dom';

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

export async function register(username: string, password: string, role?: string): Promise<string> {
  try {
    const response = await api.post('/auth/register', { userName: username, password, role });
    const token = response.data.token; // Assuming the token is returned in the response
    localStorage.setItem('token', token); // Store the token in localStorage
    return token;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

export function logout() {
  // const navigate = useNavigate();
  localStorage.removeItem('token'); // Remove the token from localStorage
  window.location.href = '/login'; // Redirect to login page after logout
  // navigate('/login');
}