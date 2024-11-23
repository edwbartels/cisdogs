import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import useAuthStore from './authStore'
import useItemStore, { Item } from './itemStore'
import useListingStore, { Listing } from './listingStore'
import fetchWithAuth from '../utils/fetch'
interface UserStore {
	collection: Set<number>
	watchlist: Set<number>
	itemIds: number[]
	itemDetails: {
		[key: number]: Item
	}
	listingIds: number[]
	listingDetails: {
		[key: number]: Listing
	}
	getCollection: () => void
	addToCollection: (item: { release_id: number; owner_id: number }) => void
	getWatchlist: () => void
	// setCollection: (newCollection: Set<number>) => void
	updateItemIds: () => void
	updateListingIds: () => void
	updateDashboard: () => void
	updateDashboardItems: () => void
	updateDashboardListings: () => void
	removeItem: (id: number) => void
	removeListing: (id: number) => void
	// getUserItems: () => void
	// getUserListings: () => void
}

const useUserStore = create(
	devtools<UserStore>(
		(set) => ({
			itemIds: [],
			listingIds: [],
			collection: new Set(),
			getCollection: async () => {
				try {
					const url = '/api/collection'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						const error = await res.text()
						console.log(error)
						throw new Error('Failed to get user collection')
					}
					const data = await res.json()
					set({ collection: new Set(data) })
				} catch (e) {
					console.error(e)
				}
			},
			watchlist: new Set(),
			getWatchlist: async () => {
				try {
					const url = '/api/watchlist'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						const error = await res.text()
						console.log(error)
						throw new Error('Failed to get user watchlist')
					}
					const data = await res.json()
					set({ watchlist: new Set(data) })
					console.log(new Set(data))
				} catch (e) {
					console.error(e)
				}
			},
			addToCollection: async (item) => {
				try {
					const url = '/api/items/'
					const res = await fetchWithAuth(url, {
						method: 'POST',
						body: JSON.stringify(item),
						credentials: 'include',
					})
					if (!res.ok) {
						const error = await res.text()
						console.log(error)
						throw new Error('Failed to add to collection')
					}
					const data = await res.json()
					console.log(data)
					set((state) => {
						const updatedSet = new Set(state.collection)
						console.log(data.release_id)
						!updatedSet.has(data.release_id) && updatedSet.add(data.release_id)
						return { collection: updatedSet }
					})
				} catch (e) {
					console.error(e)
				}
			},
			itemDetails: {},
			listingDetails: {},
			updateItemIds: () => {
				const userId = useAuthStore.getState().user?.id
				const items = useItemStore.getState().items
				if (userId) {
					const ownedItems = Object.values(items)
						.filter((item) => item.owner.id === userId)
						.map((item) => item.id)
					set({ itemIds: ownedItems })
				}
			},
			updateListingIds: () => {
				const userId = useAuthStore.getState().user?.id
				const listings = useListingStore.getState().listings
				if (userId) {
					const ownedListings = Object.values(listings)
						.filter((listing) => listing.seller.id === userId)
						.map((item) => item.id)
					set({ listingIds: ownedListings })
				}
			},
			updateDashboard: async () => {
				try {
					const url = '/api/users/dashboard'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						throw new Error('Fetch users dashboard data failed')
					}
					const data = await res.json()
					set({ itemDetails: data.items })
					set({ listingDetails: data.listings })
				} catch (e) {
					console.error(e)
				}
			},
			updateDashboardItems: async () => {
				try {
					const url = '/api/users/items'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						throw new Error("Fetch user's items failed")
					}
					const data = await res.json()
					set({ itemDetails: data })
				} catch (e) {
					console.error(e)
				}
			},
			updateDashboardListings: async () => {
				try {
					const url = '/api/users/listings'
					const res = await fetchWithAuth(url)
					if (!res.ok) {
						throw new Error("Fetch user's listings failed")
					}
					const data = await res.json()
					set({ listingDetails: data })
				} catch (e) {
					console.error(e)
				}
			},
			removeItem: async (id: number) => {
				try {
					const url = `/api/items/${id}`
					const res = await fetchWithAuth(url, {
						method: 'DELETE',
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to delete item')
					}
					set((state) => {
						const newItems = { ...state.itemDetails }
						delete newItems[id]
						return { itemDetails: newItems }
					})
				} catch (e) {
					console.error(e)
				}
			},
			removeListing: async (id: number) => {
				try {
					const url = `/api/listings/${id}`
					const res = await fetchWithAuth(url, {
						method: 'DELETE',
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to delete item')
					}
					set((state) => {
						const newListings = { ...state.listingDetails }
						delete newListings[id]
						return { listingDetails: newListings }
					})
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{
			name: 'userStore',
			// serialize: {
			// 	options: {
			// 		map: (key, value) =>
			// 			value instanceof Set ? Array.from(value) : value,
			// 	},
			// },
		}
	)
)

export default useUserStore
