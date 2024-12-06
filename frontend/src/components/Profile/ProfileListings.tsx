import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import useUserStore from '../../stores/userStore'
import ProfileListingTile from './ProfileListingTile'
import useProfileStore from '../../stores/profileStore'

interface ProfileListingsProps {
	userId: number
}

const ProfileListings: React.FC<ProfileListingsProps> = ({ userId }) => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { listings, getListings, clearState } = useProfileStore(
		(state) => state.listings
	)
	const hasMore = useProfileStore(
		(state) => state.listings.pagination?.has_more
	)
	const sortedIds = useProfileStore(
		(state) => state.listings.pagination?.sorted_ids
	)

	useEffect(() => {
		getListings(userId)
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getListings])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getListings(userId).finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, getListings])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => (
						<ProfileListingTile key={id} listingId={Number(id)} />
					))}
			</div>
			{hasMore && (
				<div ref={ref} className="loader pt-16 self-center">
					Loading...
				</div>
			)}
		</div>
	)
}

export default ProfileListings
