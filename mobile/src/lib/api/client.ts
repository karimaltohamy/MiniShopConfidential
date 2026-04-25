import axios from 'axios';
import { supabase } from '../supabase';

let baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';


export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    console.log('Request interceptor - config:', { url: config.url, method: config.method });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('Added auth token');
      } else {
        console.log('No session found');
      }
    } catch (err) {
      console.error('Error getting session:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', { status: response.status, data: response.data });
    return response;
  },
  async (error) => {
    console.log('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Token expired, sign out user
      await supabase.auth.signOut();
    }

    // Transform error to include response data at top level for easier access
    const transformedError = {
      ...error,
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
    };

    return Promise.reject(transformedError);
  }
);
