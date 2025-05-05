import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/url.config';
import { toast } from 'react-toastify';

const UseAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestAPI = async (method, endpoint, data = null, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      console.log(`${BASE_URL}${endpoint}`)
      const response = await axios({
        method: method,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers,
        // withCredentials: true,
      });
      
      return response.data;
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      
      if (options.showErrorToast !== false) {
        toast.error(errorMessage);
      }
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  

  return { requestAPI, loading, error };
};

export default UseAPI;