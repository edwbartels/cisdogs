import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Album = {
	id: number
	title: string
	track_data: {
		[key: number]: string
	}
	artist: {
		id: number
		name: string
	}
	releases: {
		[key: number]: {
			id: number
			media_type: string
			variant: string
		}
	}
	listings: {
		[key: number]: {
			id: number
			price: number
			quality: string
			description: string
			status: string
			active: boolean
			seller: {
				id: number
				username: string
			}
		}
	}
	items: {
		[key: number]: {
			id: number
			username: string
		}
	}
}

interface AlbumStore {
	focus: Album | null
	getFocus: (id: number) => Promise<void>
}

const useAlbumStore = create(
	devtools<AlbumStore>(
		(set) => ({
			focus: null,
			getFocus: async (id) => {
				try {
					const url = `/api/albums/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch release(id: ${id})`)
					}
					const album = await res.json()
					console.log(album)
					set({ focus: album })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Albums' }
	)
)

export default useAlbumStore