import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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
		[key: number]: Listing
	}
	getFocus: (id: number) => Promise<void>
	updateListings: () => Promise<void>
	getByListings: (parent: string, id: number) => void
}

const useListingStore = create(
	devtools<ListingStore>(
		(set) => ({
			focus: null,
			listings: {},
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
				try {
					const url = '/api/listings/full'
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Fetch all listings failed')
					}
					const allListings = await res.json()
					set({ listings: allListings })
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
