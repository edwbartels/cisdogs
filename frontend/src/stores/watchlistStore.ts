import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import useUserStore from './userStore'
import fetchWithAuth from '../utils/fetch'
import { Listing } from './listingStore'

export type WatchlistRelease = {
	id: number
	media_type: string
	variant: string
	album: {
		id: number
		title: string
		track_data: {
			[key: number]: string
		}
	}
	artist: {
		id: number
		name: string
	}
}

interface WatchlistStore {
	releaseDetails: {
		[key: number]: WatchlistRelease
	}
	listingDetails: {
		[key: number]: Listing
	}
	getReleases: () => void
	getListings: () => void
}

const useWatchlistStore = create(
	devtools<WatchlistStore>(
		(set) => ({
			releaseDetails: {},
			listingDetails: {},
			getReleases: async () => {
				try {
					const url = '/api/watchlist/releases'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						const error = await res.text()
						console.log(error)
						throw new Error('Failed to get watchlist releases')
					}
					const data = await res.json()
					console.log(data)
					set({ releaseDetails: data })
				} catch (e) {
					console.error(e)
				}
			},
			getListings: async () => {
				try {
					const url = '/api/watchlist/listings'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						const error = await res.text()
						console.log(error)
						throw new Error('Failed to get watchlist listings')
					}
					const data = await res.json()
					console.log(data)
					set({ listingDetails: data })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Watchlist' }
	)
)
export default useWatchlistStore
