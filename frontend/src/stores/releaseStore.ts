import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Pagination } from '../utils/types'
import Releases from '../components/Releases/Releases'
import fetchWithAuth from '../utils/fetch'

export type Release = {
	id: number
	media_type: string
	variant: string
	album: {
		id: number
		title: string
		track_data: {
			[key: number]: string
		}
		art: string | null
	}
	artist: {
		id: number
		name: string
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
interface ReleaseStore {
	focus: Release | null
	releases: {
		[key: number]: Release
	}
	pagination: Pagination
	clearState: () => void
	getFocus: (id: number) => Promise<void>
	getReleases: () => Promise<void>
	getByReleases: (parent: string, id: number) => void
}

const useReleaseStore = create(
	devtools<ReleaseStore>(
		(set, get) => ({
			focus: null,
			releases: {},
			pagination: null,
			clearState: async () => {
				const url = '/api/releases/clear_cache'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					credentials: 'include',
				})
				if (!res.ok) {
					throw new Error('Failed to clear releases cache')
				}
				set({ focus: null, releases: {}, pagination: null })
			},
			getFocus: async (id) => {
				try {
					const url = `/api/releases/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch release (id: ${id})`)
					}
					const release = await res.json()
					set({ focus: release })
				} catch (e) {
					console.error(e)
				}
			},
			getReleases: async () => {
				const { pagination, releases } = get()
				const page = pagination?.current_page ?? 0
				try {
					const url = `/api/releases/?page=${page + 1}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to get all releases`)
					}
					const data = await res.json()
					const { entries, sorted_ids, ...remaining } = data
					set({ releases: { ...releases, ...entries } })
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
			getByReleases: async (parent, id) => {
				set({ releases: {} })
				try {
					const url = `/api/releases/${parent}/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						if (res.status === 404) set({ releases: {} })
						return
						throw new Error(`Failed to get releases by ${parent}.`)
					}
					const data = await res.json()
					set({ releases: data })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Releases' }
	)
)

export default useReleaseStore
