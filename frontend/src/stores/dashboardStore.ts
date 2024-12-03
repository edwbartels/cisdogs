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
		deleteItem: (id: number) => Promise<void>
	}
	listings: {
		listings: {
			[key: number]: Listing
		}
		pagination: Pagination
		clearState: () => Promise<void>
		getListings: () => Promise<void>
		deleteListing: (id: number) => Promise<void>
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
				deleteItem: async (id: number) => {
					try {
						const url = `/api/items/${id}`
						const res = await fetchWithAuth(url, {
							method: 'DELETE',
							credentials: 'include',
						})
						if (!res.ok) {
							throw new Error('Failed to delete item')
						}
						await get().items.clearState()
						await get().items.getItems()
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
				deleteListing: async (id: number) => {
					try {
						const url = `/api/listings/${id}`
						const res = await fetchWithAuth(url, {
							method: 'DELETE',
							credentials: 'include',
						})
						if (!res.ok) {
							throw new Error('Failed to cancel listing')
						}
						await get().listings.clearState()
						await get().listings.getListings()
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
								all: {
									...state.orders.all,
									orders: {},
									pagination: null,
								},
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
					clearStateSales: async () => {
						const url = '/api/dashboard/clear_cache/sales'
						const res = await fetchWithAuth(url, {
							method: 'POST',
						})
						if (!res.ok) {
							throw new Error('Failed to clear dashboard sales cache')
						}
						set((state) => ({
							orders: {
								...state.orders,
								sales: {
									...state.orders.sales,
									sales: {},
									pagination: null,
								},
							},
						}))
					},
					getSales: async () => {
						const { pagination, sales } = get().orders.sales
						const page = pagination?.current_page ?? 0
						try {
							const url = `/api/dashboard/sales?page=${page + 1}`
							const res = await fetchWithAuth(url, {
								credentials: 'include',
							})
							if (!res.ok) {
								throw new Error('Fetch dashboard sales failed')
							}
							const data = await res.json()
							const { entries, sorted_ids, ...remaining } = data
							set((state) => ({
								orders: {
									...state.orders,
									sales: {
										...state.orders.sales,
										sales: {
											...sales,
											...entries,
										},
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
				purchases: {
					purchases: {},
					pagination: null,
					clearStatePurchases: async () => {
						const url = '/api/dashboard/clear_cache/purchases'
						const res = await fetchWithAuth(url, {
							method: 'POST',
						})
						if (!res.ok) {
							throw new Error('Failed to clear dashboard purchases cache')
						}
						set((state) => ({
							orders: {
								...state.orders,
								purchases: {
									...state.orders.purchases,
									purchases: {},
									pagination: null,
								},
							},
						}))
					},
					getPurchases: async () => {
						const { pagination, purchases } = get().orders.purchases
						const page = pagination?.current_page ?? 0
						try {
							const url = `/api/dashboard/purchases?page=${page + 1}`
							const res = await fetchWithAuth(url, {
								credentials: 'include',
							})
							if (!res.ok) {
								throw new Error('Fetch dashboard purchases failed')
							}
							const data = await res.json()
							const { entries, sorted_ids, ...remaining } = data
							set((state) => ({
								orders: {
									...state.orders,
									purchases: {
										...state.orders.purchases,
										purchases: {
											...purchases,
											...entries,
										},
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
			},

			getDashboardAll: async () => {},
			clearDashboardState: () => {},
		}),
		{ name: 'Dashboard' }
	)
)

export default useDashboardStore
