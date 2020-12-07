import axios from "axios";

const api = axios.create({
baseURL: 'https://he11o.com/id/api',
headers: {
"Accept": 'application/json',
'Content-Type': 'multipart/form-data',
},
});
export default api;