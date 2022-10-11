import axios from './http'

export default {
  get(publicId: string) {
    return axios
      .get(`/api/v1/checkout/${publicId}`, {})
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
      .post('/api/v1/checkout', data)
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },
}
