import axios from "axios";

const api = axios.create({
  baseURL: "https://proffybruno.herokuapp.com/",
});

export default api;
