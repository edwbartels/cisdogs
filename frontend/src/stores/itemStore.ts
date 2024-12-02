import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Pagination } from '../utils/types'
import fetchWithAuth from '../utils/fetch'

export type Item = {
	id: number
	owner: {
		id: number
		username: string
	}
	listing: {
		id: number
		active: boolean
		status: 'available' | 'closed'
		price: number
		quality: 'm' | 'vg' | 'g' | 'f' | 'vg'
		description: string | null
	} | null
	release: {
		id: number
		media_type: 'vinyl' | 'cassette' | 'cd'
		variant: string | null
	}
	album: {
		id: number
		title: string
		track_data: string[] | Record<number, string>
		art: string | null
	}
	artist: {
		id: number
		name: string
	}
}

interface ItemStore {
	focus: Item | null
	items: {
		[key: number]: Item
	}
	pagination: Pagination
	clearState: () => void
	getFocus: (id: number) => Promise<void>
	updateItems: () => Promise<void>
}

const useItemStore = create(
	devtools<ItemStore>(
		(set, get) => ({
			focus: null,
			items: {},
			pagination: null,
			clearState: async () => {
				const url = '/api/items/clear_cache'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					credentials: 'include',
				})
				if (!res.ok) {
					throw new Error('Failed to clear items cache')
				}
				set({ focus: null, items: {}, pagination: null })
			},
			getFocus: async (id) => {
				try {
					const url = `/api/items/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch item (id:${id})`)
					}
					const item = await res.json()
					set({ focus: item })
				} catch (e) {
					console.error(e)
				}
			},
			updateItems: async () => {
				const { pagination, items } = get()
				const page = pagination?.current_page ?? 0
				try {
					const url = `/api/items/full?page=${page + 1}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Fetch all items failed')
					}
					const data = await res.json()
					const { entries, sorted_ids, ...remaining } = data
					set({ items: { ...items, ...entries } })
					set({
						pagination: {
							...remaining,
							sorted_ids: [
								...(pagination?.sorted_ids || []),
								...sorted_ids.map((id: string) => id),
							],
						},
					})
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'itemStore' }
	)
)

export default useItemStore
