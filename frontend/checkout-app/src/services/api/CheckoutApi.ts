import axios from './http'

export default {
  get(publicId: string) {
    // return new Promise((resolve) => {
    //   resolve({
    //     data: {
    //       public_id: '123456789',
    //       created: '2020-01-01T00:00:00.000Z',
    //       modified: '2020-01-01T00:00:00.000Z',
    //       expiration: '2020-01-01T00:00:00.000Z',
    //       event_id: '123456789',
    //       name: 'John Doe',
    //       email: 'test@test.com',
    //       cost: 100,
    //       status: 'paid',
    //       tx_type: 'tier_fiat',
    //     },
    //   })
    // })

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

  getItems(publicId: any) {
    // return new Promise((resolve) => {
    //   resolve({
    //     data: [
    //       {
    //         public_id: '123456789',
    //         created: '2020-01-01T00:00:00.000Z',
    //         modified: '2020-01-01T00:00:00.000Z',
    //         ticket_tier: {
    //           public_id: 1,
    //           ticket_type: 'General Admission',
    //           tier_fiat: {
    //             id: 1,
    //             price: 1,
    //           },
    //           tier_cryptocurrency: {
    //             id: 1,
    //             price: 1,
    //           },
    //           tier_asset_ownership: {
    //             id: 1,
    //             price: 1,
    //           },
    //         },
    //         quantity: 1,
    //       },
    //       {
    //         public_id: '1234567829',
    //         created: '2020-01-01T00:00:00.000Z',
    //         modified: '2020-01-01T00:00:00.000Z',
    //         ticket_tier: {
    //           public_id: 2,
    //           ticket_type: 'General Admission 2',
    //           tier_fiat: {
    //             id: 1,
    //             price: 1,
    //           },
    //           tier_cryptocurrency: {
    //             id: 1,
    //             price: 1,
    //           },
    //           tier_asset_ownership: {
    //             id: 1,
    //             price: 1,
    //           },
    //         },
    //         quantity: 2,
    //       },
    //     ],
    //   })
    // })
    return axios
      .get(`/api/checkout/v1/session/${publicId}/items`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },
}
