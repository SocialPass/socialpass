// Event Portal API
const prodURL = import.meta.env.VITE_APP_API_URL
const devURL = 'http://localhost:8000/api'
// const baseURL = import.meta.env.PROD ? prodURL : devURL

function getbaseUrl() {
  return import.meta.env.PROD ? prodURL : devURL
}

// TicketedEventRetrieve API call
export class TicketedEventRetrieve {
  // wrapper for backend - TicketedEventRetrieve
  static call = async ({ public_id }) => {
    // set url
    const url = `${getbaseUrl()}/checkout-portal/v1/retrieve/${public_id}/`
    // set request options
    const requestOptions = {
      method: 'GET',
    }

    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then((json) => {
        const obj = json
        Object.assign(obj, {
          httpStatus: 200,
        })
        return obj
      })
      .catch((error) => {
        return error.json().then((errorJson) => {
          const e = {
            httpStatus: error.status,
            message: errorJson,
          }
          return e
        })
      })
  }
}

// TicketedEventRequestAccess class
// Used for requesting access to a TicketedEvent
export class TicketedEventRequestAccess {
  // wrapper for backend - TicketedEventRequestAccess
  static call = async ({ public_id, checkout_type }) => {
    // set url
    const url = `${getbaseUrl()}/checkout-portal/v1/request/${public_id}/?checkout_type=${checkout_type}`

    // set request options
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    // fetch
    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then((json) => {
        const obj = json
        Object.assign(obj, {
          httpStatus: 200,
        })
        return obj
      })
      .catch((error) => {
        return error.json().then((errorJson) => {
          const e = {
            httpStatus: error.status,
            message: errorJson,
          }
          return e
        })
      })
  }
}

// TicketedEventGrantAccess class
// Used for granting access to a TicketedEvent
export class TicketedEventGrantAccess {
  // wrapper for backend - TicketedEventRequestAccess
  static call = async ({
    public_id,
    checkout_type,
    wallet_address,
    signed_message,
    blockchain_ownership_id,
    tickets_requested,
  }) => {
    // setup url
    const url = `${getbaseUrl()}/checkout-portal/v1/process/${public_id}/?checkout_type=${checkout_type}`

    // set body
    const body = JSON.stringify({
      wallet_address: wallet_address,
      signed_message: signed_message,
      blockchain_ownership_id: blockchain_ownership_id,
      tickets_requested: tickets_requested,
    })

    // set request options
    const requestOptions = {
      method: 'POST',
      body: body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    // fetch
    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then((json) => {
        const obj = json
        Object.assign(obj, {
          httpStatus: 200,
        })
        return obj
      })
      .catch((error) => {
        return error.json().then((errorJson) => {
          const e = {
            httpStatus: error.status,
            message: errorJson,
          }
          return e
        })
      })
  }
}
