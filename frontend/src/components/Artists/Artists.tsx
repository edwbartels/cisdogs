import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import useArtistStore from '../../stores/artistStore'
import ArtistTile from './ArtistTile'

const Artists: React.FC = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { artists, getArtists, clearState } = useArtistStore((state) => state)
	const hasMore = useArtistStore((state) => state.pagination?.has_more)
	const sortedIds = useArtistStore((state) => state.pagination?.sorted_ids)

	useEffect(() => {
		getArtists()
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getArtists])
	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getArtists().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore])
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 pl-4 mt-4">
				{sortedIds &&
					sortedIds.map((id) => <ArtistTile key={id} artistId={id} />)}
			</div>
			{hasMore && (
				<div ref={ref} className="loader">
					Loading...
				</div>
			)}
		</div>
	)
}
export default Artists
