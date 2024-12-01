import { useEffect } from 'react'
import useReleaseStore from '../../stores/releaseStore'
import useListingStore from '../../stores/listingStore'
import ListingTile from '../Listings/ListingTileMain'

const ReleaseDetailsListings = () => {
	const releaseId = useReleaseStore((state) => state.focus?.id)
	const { listings, getByListings } = useListingStore((state) => state)

	useEffect(() => {
		getByListings('release', Number(releaseId))
	}, [releaseId])

	if (!Object.keys(listings).length)
		return <div className="m-4">No listings found.</div>
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(listings).map((id) => (
					<ListingTile key={id} listingId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default ReleaseDetailsListings
