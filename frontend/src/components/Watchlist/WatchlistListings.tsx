import { useEffect } from 'react'
import useWatchlistStore from '../../stores/watchlistStore'
import useUserStore from '../../stores/userStore'
import WatchlistListingTile from './WatchlistListingTile'

const WatchlistListings = () => {
	const watchlist = useUserStore((state) => state.watchlist)
	const { listingDetails, getListings } = useWatchlistStore((state) => state)

	useEffect(() => {
		getListings()
	}, [watchlist])
	if (!listingDetails) return <div>Loading listings...</div>
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(listingDetails).map((id) => (
					<WatchlistListingTile key={id} listingId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default WatchlistListings
