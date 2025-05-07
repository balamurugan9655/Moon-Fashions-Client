import axios from 'axios';
const instance = axios.create({ baseURL: 'https://moon-fashions-server.onrender.com/api' });
export default instance;