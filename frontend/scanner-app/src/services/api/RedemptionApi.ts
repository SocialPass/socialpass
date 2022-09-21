import axios from './http'

export default {

  get(redemptionPublicId: string) {
    return axios
      .get(`/api/scanner/v1/${redemptionPublicId}/event/`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },
}
