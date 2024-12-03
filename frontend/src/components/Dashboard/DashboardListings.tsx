import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import DashboardListingTile from './DashboardListingTile'
import useDashboardStore from '../../stores/dashboardStore'

const DashboardListings = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { getListings, clearState } = useDashboardStore(
		(state) => state.listings
	)
	const hasMore = useDashboardStore(
		(state) => state.listings.pagination?.has_more
	)
	const sortedIds = useDashboardStore(
		(state) => state.listings.pagination?.sorted_ids
	)

	useEffect(() => {
		getListings()
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getListings])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getListings().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, getListings])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => (
						<DashboardListingTile key={id} listingId={Number(id)} />
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

export default DashboardListings
