import axios from 'axios';
import API_URL from '../axiourl';
import { useUser } from "../UserContext";

const createApiClient = (token) => {
    const client = axios.create({
        baseURL: API_URL,
        headers: {
            'Accept': 'application/json',
        },
    });
    
    client.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        console.log('Unauthorized access');
                        break;
                    case 403:
                        console.log('Forbidden access');
                        break;
                    case 404:
                        console.log('Resource not found');
                        break;
                    case 500:
                        console.log('Server error');
                        break;
                    default:
                        console.log('An error occurred');
                }
            }
            return Promise.reject(error);
        }
    );
    
    return client;
};

export const useApiClient = () => {
    const { token } = useUser();
    return createApiClient(token);
};

export default createApiClient;