import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Order = {
	id: number
	price: number
	quality: string
	description: string
	created: string
	type: 'sale' | 'purchase' | null
	seller: {
		id: number
		username: string
	}
	buyer: {
		id: number
		username: string
	}
	listing: {
		id: number
		price: number
		quality: string
		description: string | null
		status: string
		active: boolean
	}
	item: {
		id: number
	}
	reviews: {
		[key: number]: {
			id: number
			rating: number
			comment: string | null
		}
	}
	release: {
		id: number
		media_type: string
		variant: string | null
	}
	album: {
		id: number
		title: string
		track_data: {
			[key: number]: string
		}
	}
	artist: {
		id: number
		name: string
	}
}
interface OrderStore {
	focus: Order | null
	getFocus: (id: number) => Promise<void>
}

const useOrderStore = create(
	devtools<OrderStore>(
		(set) => ({
			focus: null,
			getFocus: async (id) => {
				try {
					const url = `/api/orders/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch order (id: ${id})`)
					}
					const order = await res.json()
					// console.log(order)
					set({ focus: order })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Orders' }
	)
)

export default useOrderStore
