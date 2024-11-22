import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import useAuthStore from './authStore'
import useItemStore, { Item } from './itemStore'
import useListingStore, { Listing } from './listingStore'
interface UserStore {
	itemIds: number[]
	itemDetails: {
		[key: number]: Item
	}
	listingIds: number[]
	listingDetails: {
		[key: number]: Listing
	}
	updateItemIds: () => void
	updateListingIds: () => void
	updateDashboard: () => void
	updateDashboardItems: () => void
	updateDashboardListings: () => void
	removeItem: (id: number) => void
	// getUserItems: () => void
	// getUserListings: () => void
}

const useUserStore = create(
	devtools<UserStore>(
		(set) => ({
			itemIds: [],
			listingIds: [],
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
					const token = localStorage.getItem('accessToken')
					const url = '/api/users/dashboard'
					const res = await fetch(url, {
						method: 'GET',
						headers: { Authorization: `Bearer ${token}` },
					})
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
					const token = localStorage.getItem('accessToken')
					const url = '/api/users/items'
					const res = await fetch(url, {
						method: 'GET',
						headers: { Authorization: `Bearer ${token}` },
					})
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
					const token = localStorage.getItem('accessToken')
					const url = '/api/users/listings'
					const res = await fetch(url, {
						method: 'GET',
						headers: { Authorization: `Bearer ${token}` },
					})
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
					const token = localStorage.getItem('accessToken')
					const url = `/api/items/${id}`
					const res = await fetch(url, {
						method: 'DELETE',
						headers: { Authorization: `Bearer ${token}` },
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
		}),
		{ name: 'userStore' }
	)
)

export default useUserStore
