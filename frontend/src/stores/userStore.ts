import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import useAuthStore from './authStore'
import useItemStore, { Item } from './itemStore'
import useListingStore, { Listing } from './listingStore'
interface UserStore {
	itemIds: number[]
	listingIds: number[]
	itemDetails: {
		[key: number]: Item
	}
	listingDetails: {
		[key: number]: Listing
	}
	updateItemIds: () => void
	updateListingIds: () => void
	updateDashboard: () => void
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
						.filter((item) => item.owner_id === userId)
						.map((item) => item.id)
					set({ itemIds: ownedItems })
				}
			},
			updateListingIds: () => {
				const userId = useAuthStore.getState().user?.id
				const listings = useListingStore.getState().listings
				if (userId) {
					const ownedListings = Object.values(listings)
						.filter((listing) => listing.seller_id === userId)
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
			// getUserItems: () => {},
			// getUserListings: () => {},
		}),
		{ name: 'userStore' }
	)
)

export default useUserStore
