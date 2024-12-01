import { useEffect } from 'react'
import ListingTileMain from './ListingTileMain'
import useListingStore from '../../stores/listingStore'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'

const ListingsMain = () => {
	const { listings, updateListings } = useListingStore((state) => state)
	const sortedIds = useListingStore((state) => state.pagination?.sorted_ids)
	const updateUserListings = useUserStore((state) => state.updateListingIds)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		updateListings().then(() => {
			if (userId) {
				updateUserListings()
			}
		})
	}, [updateListings])

	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Homepage</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => <ListingTileMain key={id} listingId={id} />)}
			</div>
		</div>
	)
}

export default ListingsMain
