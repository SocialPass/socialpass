class FetcherError extends Error {
  info: any;
  status: number | undefined;
}

async function fetcher(url:string) {
	const res = await fetch(url);
	// If the status code is not in the range 200-299,
	// we still try to parse and throw it.
	if (!res.ok) {
		const error = new FetcherError('An error occurred while fetching the data.');
		// Attach extra info to the error object.
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
}