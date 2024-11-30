import useAuthStore from '../stores/authStore'

const fetchWithAuth = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const token = useAuthStore.getState().accessToken

	const headers = {
		...options.headers,
		Authorization: token ? `Bearer ${token}` : '',
		'Content-Type': 'application/json',
	}

	const fetchOptions: RequestInit = {
		...options,
		headers,
	}

	try {
		const response = await fetch(url, fetchOptions)

		if (!response.ok) {
			console.error(`Fetch error: ${response.status} - ${response.statusText}`)
			if (response.status === 400) alert('Already exists!')
			throw new Error(`Error: ${response.status}`)
		}

		return response
	} catch (e) {
		console.error('FetchWithAuth error', e)
		throw e
	}
}

export default fetchWithAuth
