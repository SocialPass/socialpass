import axios from './http'

export default {
  get(publicId: string) {
    return new Promise((resolve) => {
      resolve({
        data: {
          public_id: '123456789',
          created: '2020-01-01T00:00:00.000Z',
          modified: '2020-01-01T00:00:00.000Z',
          expiration: '2020-01-01T00:00:00.000Z',
          event_id: '123456789',
          name: 'John Doe',
          email: 'test@test.com',
          cost: 100,
          status: 'paid',
        },
      })
    })

    // return axios
    //   .get(`/api/v1/checkout/${publicId}`, {})
    //   .then((response) => Promise.resolve(response))
    //   .catch((error) =>
    //     Promise.reject({
    //       detail: error.response.data?.detail || 'unknown-error',
    //       message: error.response.data?.message || 'unknown-error',
    //     }),
    //   )
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

  getItems(publicId: any) {
    return new Promise((resolve) => {
      resolve({
        data: [
          {
            public_id: '123456789',
            created: '2020-01-01T00:00:00.000Z',
            modified: '2020-01-01T00:00:00.000Z',
            ticket_tier: {
              public_id: 1,
              ticket_type: 'General Admission',
              price: 10000,
            },
            quantity: 1,
          },
          {
            public_id: '1234567829',
            created: '2020-01-01T00:00:00.000Z',
            modified: '2020-01-01T00:00:00.000Z',
            ticket_tier: {
              public_id: 2,
              ticket_type: 'General Admission 2',
              price: 200,
            },
            quantity: 2,
          },
        ],
      })
    })
    // return axios
    //   .get(`/api/v1/checkout/${publicId}/items`, {})
    //   .then((response) => Promise.resolve(response))
    //   .catch((error) =>
    //     Promise.reject({
    //       detail: error.response.data?.detail || 'unknown-error',
    //       message: error.response.data?.message || 'unknown-error',
    //     }),
    //   )
  },
}
