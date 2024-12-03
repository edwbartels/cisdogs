import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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
	getFocus: (id: number) => Promise<void>
	getReleases: () => void
	getByReleases: (parent: string, id: number) => void
}

const useReleaseStore = create(
	devtools<ReleaseStore>(
		(set) => ({
			focus: null,
			releases: {},
			getFocus: async (id) => {
				try {
					const url = `/api/releases/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch release (id: ${id})`)
					}
					const release = await res.json()
					// console.log(release)
					set({ focus: release })
				} catch (e) {
					console.error(e)
				}
			},
			getReleases: async () => {
				try {
					const url = '/api/releases/'
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to get all releases`)
					}
					const data = await res.json()
					set({ releases: data })
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
