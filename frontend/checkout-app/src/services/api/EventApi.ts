import axios from './http'

export default {
  get(publicId: string) {
    // return new Promise((resolve) => {
    //   resolve({
    //     data: {
    //       public_id: '123456789',
    //       team: {
    //         name: 'main team',
    //         image: null,
            // theme: {
            //   logo: 'http://localhost:8000/static/brand-logos/SocialPass-Icon.svg',
            //   favicon: 'http://localhost:8000/static/brand-logos/SocialPass-Icon.svg',
            //   css_theme: 'http://localhost:8000/static/socialpass-theme/socialpass-theme.css',
            //   brand_name: 'SocialPass',
            // },
    //       },
    //       title: 'NFT Holders Party',
    //       description:
    //         'Come celebrate with the SocialPass Team! All NFT holders are invited. You just need to make sure youre 21+ to enter.',
    //       requirements: 'requirements',
    //       limit_per_person: 5,
    //       start_date: '%A, %B %d, %Y | %H:%M%p',
    //       timezone: 'EST',
    //       localized_address_display: 'James L. Knight Center, Miami, Florida, USA',
    //       capacity: 100,
    //       ticket_count: 10,
    //       cover_image:
    //         'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //       show_ticket_count: true,
    //       show_team_image: true,
    //     },
    //   })
    // })

    return axios
      .get(`/api/checkout/v1/event/${publicId}/`, {})
      .then((response) => Promise.resolve(response))
      .catch((error) =>
        Promise.reject({
          detail: error.response.data?.detail || 'unknown-error',
          message: error.response.data?.message || 'unknown-error',
        }),
      )
  },

  getTicketTiers(publicId: string) {
    return new Promise((resolve) => {
      resolve({
        data: [
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '3f22a1db-7bf0-4444-a13b-25347c174df7',
            event_id: '1',
            ticket_type: 'General Admission',
            capacity: 10,
            max_per_person: 2,
            quantity_sold: 0,
            tier_fiat: {
              id: '1',
              price: 6,
            },
            tier_cryptocurrency: {
              id: '1',
              price: 6,
            },
            tier_asset_ownership: {
              id: '1',
              price: 5,
              contract_address: '0X18...B9D1',
            },
          },
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '3f22a1db-7bf0-4444-a13b-25347c174df8',
            event_id: '3f22a1db-7bf0-4444-a13b-25347c174df8',
            ticket_type: 'Deluxe Admission',
            capacity: 11,
            max_per_person: 2,
            quantity_sold: 0,
            tier_cryptocurrency: {
              id: '1',
              price: 2,
            },
            tier_asset_ownership: {
              id: '1',
              price: 3,
              contract_address: '0X18...B9D1',
            },
          },
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '3f22a1db-7bf0-4444-a13b-25347c174df9',
            event_id: '3f22a1db-7bf0-4444-a13b-25347c174df9',
            ticket_type: 'Deluxe Admission',
            capacity: 11,
            max_per_person: 2,
            quantity_sold: 0,
            tier_cryptocurrency: {
              id: '1',
              price: 1,
            },
            tier_asset_ownership: {
              id: '1',
              price: 1,
              contract_address: '0X18...B9D1',
            },
          },
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '3f22a1db-7bf0-4444-a13b-25347c174de1',
            event_id: '1',
            ticket_type: 'VIP Admission',
            capacity: 14,
            max_per_person: 10,
            quantity_sold: 4,
            tier_cryptocurrency: {
              id: '2',
              price: 4,
            },
          },
        ],
      })
    })

    //   return axios
    //     .get(`/api/checkout/v1/event/${publicId}/ticket_tiers`, {})
    //     .then((response) => Promise.resolve(response))
    //     .catch((error) =>
    //       Promise.reject({
    //         detail: error.response.data?.detail || 'unknown-error',
    //         message: error.response.data?.message || 'unknown-error',
    //       }),
    //     )
    // },
  },
}
