import axios from "./http";

export default {
	get(publicId: string) {
		return axios
			.get(`/api/checkout/v1/event/${publicId}/`, {})
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	getTicketTiers(publicId: string) {
		return axios
			.get(`/api/checkout/v1/event/${publicId}/ticket_tiers`, {})
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},
};
