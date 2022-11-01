import { AnyARecord } from 'dns'
import axios from './http'

export default {
  get(publicId: string) {
    return axios
      .get(`/api/checkout/v1/session/${publicId}/`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  create(data: any) {
    return axios
      .post('/api/checkout/v1/session/', data)
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  edit(publicId, data: any) {
    return axios
      .put(`/api/checkout/v1/session/${publicId}/`, data)
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  getItems(publicId: any) {
    return axios
      .get(`/api/checkout/v1/session/${publicId}/items/`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  pay(publicId: any, data: any) {
    return axios
      .post(`/api/checkout/v1/session/${publicId}/transaction/`, data)
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  getConfirmation(publicId: AnyARecord) {
    return axios
      .get(`/api/checkout/v1/session/${publicId}/confirmation`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },
}
