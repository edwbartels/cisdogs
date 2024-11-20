import { useEffect } from 'react'
import ListingTileMain from './ListingTileMain'
import useListingStore from '../stores/listingStore'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'

const ListingsMain = () => {
	const updateListings = useListingStore((state) => state.updateListings)
	const updateUserListings = useUserStore((state) => state.updateListingIds)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		updateListings().then(() => {
			if (userId) {
				updateUserListings()
			}
		})
	}, [updateListings])
	// const dummyIds: number[] = Array.from(
	// 	{ length: 16 },
	// 	(_: unknown, i: number) => i + 1
	// )
	const dummyIds: number[] = Object.keys(
		useListingStore((state) => state.listings)
	)
		.slice(0, 16)
		.map(Number)

	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Homepage</div>
			<div className="flex flex-wrap justify-center gap-4 p-4">
				{dummyIds.map((id) => (
					<ListingTileMain key={id} listingId={id} />
				))}
			</div>
		</div>
	)
}

export default ListingsMain
