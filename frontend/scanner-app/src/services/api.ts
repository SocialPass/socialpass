import axios, { AxiosPromise } from 'axios'
const prodURL = import.meta.env.VITE_APP_API_URL;
const devURL = "http://localhost:8000/api";
const BASEURL = import.meta.env.PROD ? prodURL : devURL;

const api = axios.create({
  baseURL: BASEURL,
  timeout: 100000,
})

async function fetchApi(axiosPromise: AxiosPromise){
  return await axiosPromise.then((response) => {
    return response.data
  }).catch((err) => {
    if (err.response) {
      throw {
        detail: err.response.data?.detail ||  'unknown-error',
        message: err.response.data?.message || 'unknown-error'
      }
    } else {
      throw {
        detail: 'unknown-error',
        message: err.message
      }
    }
  })
}

export function fetchEvent(publicId: String) {
  return fetchApi(
    api.get(`scanner/${publicId}/event`)
  )
}

export function fetchScanTicket(publicId: String, qrCode: String) {
  return fetchApi(
    api.post(`scanner/${publicId}/claim-ticket/`, {embed_code: qrCode})
  )
}

export function fetchTickets(publicId: String, claimed?: boolean) {
  let url = `scanner/${publicId}/tickets`
  if (claimed !== undefined){
    url = `${url}?redeemed=${claimed}`
  }

  return fetchApi(
    api.get(url)
  )
}
