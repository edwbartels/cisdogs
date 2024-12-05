import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import ReleaseTile from './ReleaseTile'
import useReleaseStore from '../../stores/releaseStore'

const Releases: React.FC = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { releases, getReleases, clearState } = useReleaseStore(
		(state) => state
	)
	const hasMore = useReleaseStore((state) => state.pagination?.has_more)
	const sortedIds = useReleaseStore((state) => state.pagination?.sorted_ids)
	useEffect(() => {
		getReleases()
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getReleases])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getReleases().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore])
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 pl-4 mt-4">
				{sortedIds &&
					sortedIds.map((id) => <ReleaseTile key={id} releaseId={id} />)}
			</div>
			{hasMore && (
				<div ref={ref} className="loader">
					Loading...
				</div>
			)}
		</div>
	)
}
export default Releases
