import axios from './http'

export default {
  get(publicId: string) {
    return new Promise((resolve) => {
      resolve({
        data: {
          team: {
            name: 'main team',
            image: null,
            theme: {
              logo: 'http://localhost:8000/static/brand-logos/SocialPass-Icon.svg',
              favicon: 'http://localhost:8000/static/brand-logos/SocialPass-Icon.svg',
              css_theme: 'http://localhost:8000/static/socialpass-theme/socialpass-theme.css',
              brand_name: 'SocialPass',
            },
          },
          title: 'NFT Holders Party',
          description:
            'Come celebrate with the SocialPass Team! All NFT holders are invited. You just need to make sure you&lsquo;re 21+ to enter.',
          requirements: 'requirements',
          limit_per_person: 5,
          start_date: '%A, %B %d, %Y | %H:%M%p',
          timezone: 'EST',
          localized_address_display: 'James L. Knight Center, Miami, Florida, USA',
          capacity: 100,
          ticket_count: 10,
          cover_image:
            'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          show_ticket_count: true,
          show_team_image: true,
        },
      })
    })

    //   return axios
    //     .get(`/api/v1/event/${publicId}`, {})
    //     .then((response) => Promise.resolve(response))
    //     .catch((error) =>
    //       Promise.reject({
    //         detail: error.response.data?.detail || 'unknown-error',
    //         message: error.response.data?.message || 'unknown-error',
    //       }),
    //     )
    // },
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
            price: '10000',
            capacity: 10,
            max_per_person: '2',
            payment_types: [
              {
                created: '2017-03-31 9:30:20',
                modified: '2017-03-31 9:30:20',
                public_id: 'public_id',
                payment_type: 'payment_type',
                ticket_tier_id: '1',
              },
            ],
          },
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '1',
            event_id: '3f22a1db-7bf0-4444-a13b-25347c174df7',
            ticket_type: 'Deluxe Admission',
            price: '2',
            capacity: 11,
            max_per_person: 'max_per_person',
            payment_types: [
              {
                created: '2017-03-31 9:30:20',
                modified: '2017-03-31 9:30:20',
                public_id: 'public_id',
                payment_type: 'payment_type',
                ticket_tier_id: '2',
              },
            ],
          },
          {
            created: '2017-03-31 9:30:20',
            modified: '2017-03-31 9:30:20',
            public_id: '3f22a1db-7bf0-4444-a13b-25347c174df7',
            event_id: '1',
            ticket_type: 'VIP Admission',
            price: '3',
            capacity: 14,
            max_per_person: 'max_per_person',
            payment_types: [
              {
                created: '2017-03-31 9:30:20',
                modified: '2017-03-31 9:30:20',
                public_id: 'public_id',
                payment_type: 'payment_type',
                ticket_tier_id: '3',
              },
            ],
          },
        ],
      })
    })

    //   return axios
    //     .get(`/api/v1/event/${publicId}/ticket_tiers`, {})
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
