import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import fetchWithAuth from '../utils/fetch'
import { Pagination } from '../utils/types'

export type Artist = {
	id: number
	name: string
	albums: {
		[key: number]: {
			id: number
			title: string
			track_data: {
				[key: number]: string
			}
		}
	}
	releases: {
		[key: number]: {
			id: number
			media_type: string
			variant: string
		}
	}
	listings: {
		[key: number]: {
			id: number
			price: number
			quality: string
			description: string
			status: string
			active: boolean
			seller: {
				id: number
				username: string
			}
		}
	}
	items: {
		[key: number]: {
			id: number
			username: string
		}
	}
}

interface ArtistStore {
	focus: Artist | null
	artists: {
		[key: number]: Artist
	}
	pagination: Pagination
	clearState: () => void
	addArtist: (
		name: string
	) => Promise<{ [key: number]: { id: number; name: string } }>
	getFocus: (id: number) => Promise<void>
	getArtists: () => Promise<void>
}

const useArtistStore = create(
	devtools<ArtistStore>(
		(set, get) => ({
			focus: null,
			artists: {},
			pagination: null,
			clearState: async () => {
				const url = '/api/artists/clear_cache'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					credentials: 'include',
				})
				if (!res.ok) {
					throw new Error('Failed to clear artists cache')
				}
				set({ focus: null, artists: {}, pagination: null })
			},
			getFocus: async (id) => {
				try {
					const url = `/api/artists/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch artist (id: ${id})`)
					}
					const artist = await res.json()
					set({ focus: artist })
				} catch (e) {
					console.error(e)
				}
			},
			getArtists: async () => {
				const { pagination, artists } = get()
				const page = pagination?.current_page ?? 0
				try {
					const url = `/api/artists/?page=${page + 1}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Failed to get all artists')
					}
					const data = await res.json()
					const { entries, sorted_ids, ...remaining } = data
					set({ artists: { ...artists, ...entries } })
					set({
						pagination: {
							...remaining,
							sorted_ids: [
								...(pagination?.sorted_ids || []),
								...sorted_ids.map((id: string) => id),
							],
						},
					})
					return data
				} catch (e) {
					console.error(e)
				}
			},
			addArtist: async (name) => {
				try {
					const url = '/api/artists/'
					const res = await fetchWithAuth(url, {
						method: 'POST',
						body: JSON.stringify({ name: name }),
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to add artist')
					}
					const data = await res.json()
					set((state) => ({ artists: { ...state.artists, ...data } }))
					return data
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Artists' }
	)
)

export default useArtistStore
