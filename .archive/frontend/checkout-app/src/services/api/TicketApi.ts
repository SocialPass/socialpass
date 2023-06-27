import axios from "./http";

export default {
	getAll(redemptionPublicId: string, claimed?: boolean) {
		return axios
			.get(`/api/scanner/v1/${redemptionPublicId}/tickets/`, { params: { claimed } })
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	claim(publicId: string, qrCode: string) {
		return axios
			.post(`/api/scanner/v1/${publicId}/claim-ticket/`, { embed_code: qrCode })
			.then((response) => Promise.resolve(response.data))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},
};
