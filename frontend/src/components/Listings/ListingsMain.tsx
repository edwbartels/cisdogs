import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import ListingTileMain from './ListingTileMain'
import useListingStore from '../../stores/listingStore'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'

const ListingsMain = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { listings, updateListings, clearState } = useListingStore(
		(state) => state
	)
	const hasMore = useListingStore((state) => state.pagination?.has_more)
	const sortedIds = useListingStore((state) => state.pagination?.sorted_ids)
	const updateUserListings = useUserStore((state) => state.updateListingIds)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		updateListings().then(() => {
			if (userId) {
				updateUserListings()
			}
		})
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [updateListings, userId, updateUserListings])
	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			updateListings().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, updateListings])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-6 pl-4 mt-4">
				{sortedIds &&
					sortedIds.map((id) => <ListingTileMain key={id} listingId={id} />)}
			</div>
			{hasMore && (
				<div ref={ref} className="loader">
					Loading...
				</div>
			)}
		</div>
	)
}

export default ListingsMain
