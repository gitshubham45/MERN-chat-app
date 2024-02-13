import axios from 'axios';

const instance = axios.create({
  baseURL: "https://chat-app-41io.onrender.com/" || 'http://localhost:5000',
});

export default instance;