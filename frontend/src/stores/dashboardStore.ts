import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import fetchWithAuth from '../utils/fetch'
import { Item } from './itemStore'
import { Listing } from './listingStore'
import { Order } from './orderStore'
import { Pagination } from '../utils/types'

interface DashboardStore {
	items: {
		items: {
			[key: number]: Item
		}
		pagination: Pagination
		clearState: () => void
		getItems: () => Promise<void>
	}
	listings: {
		listings: {
			[key: number]: Listing
		}
		pagination: Pagination
		clearState: () => void
		getListings: () => Promise<void>
	}
	orders: {
		all: {
			orders: { [key: number]: Order }
			pagination: Pagination
			clearStateAll: () => void
			getOrders: () => Promise<void>
		}
		sales: {
			sales: { [key: number]: Order }
			pagination: Pagination
			clearStateSales: () => void
			getSales: () => void
		}
		purchases: {
			purchases: { [key: number]: Order }
			pagination: Pagination
			clearStatePurchases: () => void
			getPurchases: () => void
		}
	}
	getDashboardAll: () => void
	clearDashboardState: () => void
}

const useDashboardStore = create(
	devtools<DashboardStore>(
		(set, get) => ({
			items: {
				items: {},
				pagination: null,
				clearState: async () => {
					const url = '/api/dashboard/clear_cache/items'
					const res = await fetchWithAuth(url, {
						method: 'POST',
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to clear dashboard items cache')
					}
					set((state) => ({
						items: {
							...state.items,
							items: {},
							pagination: null,
						},
					}))
				},

				getItems: async () => {
					const { pagination, items } = get().items
					const page = pagination?.current_page ?? 0
					try {
						const url = `/api/dashboard/items?=${page + 1}`
						const res = await fetchWithAuth(url)
						if (!res.ok) {
							throw new Error('Fetch all dashboard items failed')
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
					const url = '/api/dashboard/clear_cache/listings'
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

				getListings: async () => {
					const { pagination, listings } = get().listings
					const page = pagination?.current_page ?? 0
					try {
						const url = `/api/dashboard/listings?page=${page + 1}`
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
			orders: {
				all: {
					orders: {},
					pagination: null,
					clearStateAll: async () => {
						const url = '/api/dashboard/clear_cache/orders'
						const res = await fetchWithAuth(url, {
							method: 'POST',
						})
						if (!res.ok) {
							throw new Error('Failed to clear dashboard orders cache')
						}
						set((state) => ({
							orders: {
								...state.orders,
								orders: {},
								pagination: null,
							},
						}))
					},

					getOrders: async () => {
						const { pagination, orders } = get().orders.all
						const page = pagination?.current_page ?? 0
						try {
							const url = `/api/dashboard/orders?page=${page + 1}`
							const res = await fetchWithAuth(url, {
								credentials: 'include',
							})
							if (!res.ok) {
								throw new Error('Fetch all dashboard orders failed')
							}
							const data = await res.json()
							const { entries, sorted_ids, ...remaining } = data
							set((state) => ({
								orders: {
									...state.orders,
									all: {
										...state.orders.all,
										orders: { ...orders, ...entries },
										pagination: {
											...remaining,
											sorted_ids: [
												...(pagination?.sorted_ids || []),
												...sorted_ids.map((id: string) => id),
											],
										},
									},
								},
							}))
						} catch (e) {
							console.error(e)
						}
					},
				},
				sales: {
					sales: {},
					pagination: null,
					clearStateSales: () => {},
					getSales: () => {},
				},
				purchases: {
					purchases: {},
					pagination: null,
					clearStatePurchases: () => {},
					getPurchases: () => {},
				},
			},

			getDashboardAll: async () => {},
			clearDashboardState: () => {},
		}),
		{ name: 'Dashboard' }
	)
)

export default useDashboardStore
