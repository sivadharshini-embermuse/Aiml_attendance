import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = "https://aiml-lab-attendence-1.onrender.com";

export default axiosClient;