import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import fetchWithAuth from '../utils/fetch'
import { Pagination } from '../utils/types'

export type Album = {
	id: number
	title: string
	track_data: {
		[key: number]: string
	}
	art: string | null
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
	albums: {
		[key: number]: Album
	}
	pagination: Pagination
	getFocus: (id: number) => Promise<void>
	clearState: () => void
	getAlbums: () => Promise<void>
	getByAlbums: (parent: string, id: number) => void
	clearAlbums: () => void
	addAlbum: (album: {
		artist_id: number
		title: string
		track_data: { [key: number]: string }
		art: string
	}) => Promise<{
		[key: number]: {
			id: number
			artist_id: number
			title: string
			track_data: { [key: number]: string }
			art: string
		}
	}>
}

const useAlbumStore = create(
	devtools<AlbumStore>(
		(set, get) => ({
			focus: null,
			albums: {},
			pagination: null,
			clearState: async () => {
				const url = '/api/albums/clear_cache'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					credentials: 'include',
				})
				if (!res.ok) {
					throw new Error('Failed to clear albums cache')
				}
				set({ focus: null, albums: {}, pagination: null })
			},
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
			getAlbums: async () => {
				const { pagination, albums } = get()
				const page = pagination?.current_page ?? 0
				try {
					const url = `/api/albums/?page=${page + 1}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Failed to get all albums')
					}
					const data = await res.json()
					const { entries, sorted_ids, ...remaining } = data
					set({ albums: { ...albums, ...entries } })
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
			getByAlbums: async (parent, id) => {
				try {
					const url = `/api/albums/${parent}/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to get albums by ${parent}.`)
					}
					const data = await res.json()
					set({ albums: data })
				} catch (e) {
					console.error(e)
				}
			},
			clearAlbums: () => {
				set({ albums: {} })
			},
			addAlbum: async (album) => {
				try {
					const url = '/api/albums/'
					const res = await fetchWithAuth(url, {
						method: 'POST',
						body: JSON.stringify({ ...album }),
						credentials: 'include',
					})
					if (!res.ok) {
						throw new Error('Failed to add album')
					}
					const data = await res.json()
					set((state) => ({ albums: { ...state.albums, data } }))
					return data
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Albums' }
	)
)

export default useAlbumStore
