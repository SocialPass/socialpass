import axios from 'axios'
const prodURL = import.meta.env.VITE_APP_API_URL;
const devURL = "/api";
const BASEURL = import.meta.env.PROD ? prodURL : devURL;

export const api = axios.create({
  baseURL: BASEURL,
  timeout: 100000,
})

