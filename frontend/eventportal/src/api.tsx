// Event Portal API
const prodURL = import.meta.env.VITE_APP_API_URL;
const devURL = "/api";
const baseURL = import.meta.env.PROD ? prodURL : devURL;

// TicketedEventRetrieve API call
export class TicketedEventRetrieve {
  // wrapper for backend - TicketedEventRetrieve
  static call = async ({ public_id }) => {
    // set url
    const url = `${baseURL}/event-portal/ticketed-event/retrieve/${public_id}/`;
    // set request options
    var requestOptions = {
      method: "GET",
    };

    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((json) => {
        let obj = json;
        Object.assign(obj, {
          httpStatus: 200,
        });
        return obj;
      })
      .catch((error) => {
        console.log(error);
        let e = {
          httpStatus: error.status,
          message: error.json(),
        };
        return e;
      });
  };
}

// TicketedEventRequestAccess class
// Used for requesting access to a TicketedEvent
export class TicketedEventRequestAccess {
  // wrapper for backend - TicketedEventRequestAccess
  static call = async ({ public_id, access_type, address }) => {
    // set url
    const url = `${baseURL}/event-portal/ticketed-event/request-access/${public_id}?type=${access_type}`;

    // set body
    const body = JSON.stringify({
      address: address,
    });

    // set request options
    const requestOptions = {
      method: "POST",
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // fetch
    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((json) => {
        let obj = json;
        Object.assign(obj, {
          httpStatus: 200,
        });
        return obj;
      })
      .catch((error) => {
        let e = {
          httpStatus: error.status,
          message: error.json(),
        };
        return e;
      });
  };
}

// TicketedEventGrantAccess class
// Used for granting access to a TicketedEvent
export class TicketedEventGrantAccess {
  // wrapper for backend - TicketedEventRequestAccess
  static call = async ({
    public_id,
    access_type,
    address,
    signed_message,
    signature_id,
    access_data,
  }) => {
    // setup url
    const url = `${baseURL}/event-portal/ticketed-event/grant-access/${public_id}?type=${access_type}`;

    // set body
    const body = JSON.stringify({
      address: address,
      signed_message: signed_message,
      signature_id: signature_id,
      access_data: access_data,
    });

    // set request options
    const requestOptions = {
      method: "POST",
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // fetch
    return fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((json) => {
        let obj = json;
        Object.assign(obj, {
          httpStatus: 200,
        });
        return obj;
      })
      .catch((error) => {
        let e = {
          httpStatus: error.status,
          message: error.json(),
        };
        return e;
      });
  };
}
