import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Listing = {
	id: number
	active: boolean
	status: 'available' | 'closed'
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
		}),
		{ name: 'listingStore' }
	)
)

export default useListingStore
