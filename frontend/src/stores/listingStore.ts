import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Pagination } from '../utils/types'
import fetchWithAuth from '../utils/fetch'

export type Listing = {
	id: number
	active: boolean
	price: number
	quality: 'm' | 'vg' | 'g' | 'f' | 'ng'
	description: string | null
	seller: {
		id: number
		username: string
	}
	item: {
		id: number
	}
	release: {
		id: number
		media_type: 'vinyl' | 'cassette' | 'cd'
		variant: string | null
	}
	album: {
		id: number
		title: string
		track_data: {
			tracks: string[]
		}
		art: string | null
	}
	artist: {
		id: number
		name: string
	}
}

interface ListingStore {
	focus: Listing | null
	listings: {
		[key: string]: Listing
	}
	pagination: Pagination
	clearState: () => void
	getFocus: (id: number) => Promise<void>
	updateListings: () => Promise<void>
	getByListings: (parent: string, id: number) => void
}

const useListingStore = create(
	devtools<ListingStore>(
		(set, get) => ({
			focus: null,
			listings: {},
			pagination: null,
			clearState: async () => {
				const url = '/api/listings/clear_cache'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					credentials: 'include',
				})
				if (!res.ok) {
					throw new Error('Failed to clear listings cache')
				}
				set({ focus: null, listings: {}, pagination: null })
			},
			getFocus: async (id) => {
				try {
					const url = `/api/listings/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch listing (id:${id})`)
					}
					const listing = await res.json()
					set({ focus: listing })
				} catch (e) {
					console.error(e)
				}
			},
			updateListings: async () => {
				const { pagination, listings } = get()
				const page = pagination?.current_page ?? 0
				try {
					const url = `/api/listings/full?page=${page + 1}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Fetch all listings failed')
					}
					const data = await res.json()
					const { entries, sorted_ids, ...remaining } = data
					// set(state=>({listings:...state.listings,entries}))
					set({ listings: { ...listings, ...entries } })
					set({
						pagination: {
							...remaining,
							sorted_ids: [
								...(pagination?.sorted_ids || []),
								...sorted_ids.map((id: string) => id),
							],
						},
					})
					console.log(listings)
					console.log(pagination?.sorted_ids)
				} catch (e) {
					console.error(e)
				}
			},
			getByListings: async (parent, id) => {
				set({ listings: {} })
				try {
					const url = `/api/listings/${parent}/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						if (res.status === 404) set({ listings: {} })
						return
						throw new Error(`Failed to get listings by ${parent}.`)
					}
					const data = await res.json()
					set({ listings: data })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Listings' }
	)
)

export default useListingStore
