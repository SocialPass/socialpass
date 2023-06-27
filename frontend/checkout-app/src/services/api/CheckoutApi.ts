import { AnyARecord } from "dns";
import axios from "./http";

export default {
	get(publicId: string) {
		return axios
			.get(`/api/checkout/v1/session/${publicId}/`, {})
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
			.post("/api/checkout/v1/session/", data)
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
			.put(`/api/checkout/v1/session/${publicId}/`, data)
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	getItems(publicId: any) {
		return axios
			.get(`/api/checkout/v1/session/${publicId}/items/`, {})
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},

	transactNFT(publicId: any, data: any) {
		return axios
			.post(`/api/checkout/v1/session/${publicId}/nft/`, data)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error.response.data));
	},

	transactFree(publicId: any, data: any) {
		return axios
			.post(`/api/checkout/v1/session/${publicId}/free/`, data)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error.response.data));
	},

	getConfirmation(publicId: AnyARecord) {
		return axios
			.get(`/api/checkout/v1/session/${publicId}/confirmation`, {})
			.then((response) => Promise.resolve(response))
			.catch((error) =>
				Promise.reject({
					detail: error.response.data?.detail || "unknown-error",
					message: error.response.data?.message || "unknown-error",
				}),
			);
	},
};