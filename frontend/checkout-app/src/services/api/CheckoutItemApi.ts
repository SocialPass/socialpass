import axios from "./http";

export default {
	get(publicId: string) {
		return axios
			.get(`/api/checkout/v1/item/${publicId}/`, {})
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	create(data: any) {
		return axios
			.post("/api/checkout/v1/item/", data)
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	edit(publicId, data: any) {
		return axios
			.put(`/api/checkout/v1/item/${publicId}/`, data)
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	delete(publicId) {
		return axios
			.delete(`/api/checkout/v1/item/${publicId}/`)
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},
};
