import { useEffect } from 'react'
import useUserStore from '../stores/userStore'
import useWatchlistStore from '../stores/watchlistStore'
import WatchlistReleaseTile from './WatchlistReleaseTile'

const WatchlistReleases = () => {
	const watchlist = useUserStore((state) => state.watchlist)
	const { releaseDetails, getReleases } = useWatchlistStore((state) => state)

	useEffect(() => {
		getReleases()
	}, [watchlist])

	if (!releaseDetails) return <div>Loading releases...</div>

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(releaseDetails).map((id) => (
					<WatchlistReleaseTile key={id} itemId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default WatchlistReleases
