import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Artist = {
	id: number
	name: string
	albums: {
		[key: number]: {
			id: number
			title: string
			track_data: {
				[key: number]: string
			}
		}
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

interface ArtistStore {
	focus: Artist | null
	artists: {
		[key: number]: Artist
	}
	getFocus: (id: number) => Promise<void>
	getArtists: () => void
}

const useArtistStore = create(
	devtools<ArtistStore>(
		(set) => ({
			focus: null,
			artists: {},
			getFocus: async (id) => {
				try {
					const url = `/api/artists/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch artist (id: ${id})`)
					}
					const artist = await res.json()
					console.log(artist)
					set({ focus: artist })
				} catch (e) {
					console.error(e)
				}
			},
			getArtists: async () => {
				try {
					const url = '/api/artists/'
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Failed to get all artists')
					}
					const data = await res.json()
					set({ artists: data })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Artists' }
	)
)

export default useArtistStore
