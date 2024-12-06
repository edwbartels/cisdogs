import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Item } from './itemStore'
import { Listing } from './listingStore'
import { Pagination } from '../utils/types'
import fetchWithAuth from '../utils/fetch'

interface ProfileStore {
	username: string
	member_since: string
	collection_count: number
	getInfo: (userId: number) => void
	items: {
		items: {
			[key: number]: Item
		}
		pagination: Pagination
		clearState: () => Promise<void>
		getItems: (userId: number) => Promise<void>
	}
	listings: {
		listings: {
			[key: number]: Listing
		}
		pagination: Pagination
		clearState: () => Promise<void>
		getListings: (userId: number) => Promise<void>
	}
	getProfileAll: () => void
	clearProfileState: () => void
}

const useProfileStore = create(
	devtools<ProfileStore>(
		(set, get) => ({
			username: '',
			member_since: '',
			collection_count: 0,
			getInfo: async (userId) => {
				const url = `/api/profile/${userId}`
				const res = await fetch(url)
				try {
					if (!res.ok) {
						throw new Error('Failed to fetch user details')
					}
					const data = await res.json()
					console.log(data)
					set((state) => ({
						...state,
						...data,
					}))
				} catch (e) {
					console.error(e)
				}
			},
			items: {
				items: {},
				pagination: null,
				clearState: async () => {
					const url = '/api/profile/clear_cache/items'
					const res = await fetchWithAuth(url, {
						method: 'POST',
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to clear profile items cache')
					}
					set((state) => ({
						items: {
							...state.items,
							items: {},
							pagination: null,
						},
					}))
				},
				getItems: async (userId) => {
					const { pagination, items } = get().items
					const page = pagination?.current_page ?? 0
					try {
						const url = `/api/profile/items/${userId}?page=${page + 1}`
						const res = await fetchWithAuth(url)
						if (!res.ok) {
							throw new Error('Fetch all profile items failed')
						}
						const data = await res.json()
						const { entries, sorted_ids, ...remaining } = data
						set((state) => ({
							items: {
								...state.items,
								items: { ...items, ...entries },
								pagination: {
									...remaining,
									sorted_ids: [
										...(pagination?.sorted_ids || []),
										...sorted_ids.map((id: string) => id),
									],
								},
							},
						}))
					} catch (e) {
						console.error(e)
					}
				},
			},
			listings: {
				listings: {},
				pagination: null,
				clearState: async () => {
					const url = '/api/profile/clear_cache/listings'
					const res = await fetchWithAuth(url, {
						method: 'POST',
					})
					if (!res.ok) {
						throw new Error('Failed to clear dashboard listings cache')
					}
					set((state) => ({
						listings: {
							...state.listings,
							listings: {},
							pagination: null,
						},
					}))
				},

				getListings: async (userId) => {
					const { pagination, listings } = get().listings
					const page = pagination?.current_page ?? 0
					try {
						const url = `/api/profile/listings/${userId}?page=${page + 1}`
						const res = await fetchWithAuth(url, {
							credentials: 'include',
						})
						if (!res.ok) {
							throw new Error('Fetch all dashboard listings failed')
						}
						const data = await res.json()
						const { entries, sorted_ids, ...remaining } = data
						set((state) => ({
							listings: {
								...state.listings,
								listings: { ...listings, ...entries },
								pagination: {
									...remaining,
									sorted_ids: [
										...(pagination?.sorted_ids || []),
										...sorted_ids.map((id: string) => id),
									],
								},
							},
						}))
					} catch (e) {
						console.error(e)
					}
				},
			},
			getProfileAll: async () => {},
			clearProfileState: () => {},
		}),
		{ name: 'Profile' }
	)
)

export default useProfileStore
