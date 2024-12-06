import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import AlbumTile from './AlbumTile'
import useAlbumStore from '../../stores/albumStore'

const Albums: React.FC = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { getAlbums, clearState } = useAlbumStore((state) => state)
	const hasMore = useAlbumStore((state) => state.pagination?.has_more)
	const sortedIds = useAlbumStore((state) => state.pagination?.sorted_ids)
	useEffect(() => {
		getAlbums()
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getAlbums])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getAlbums().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore])
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 pl-4 mt-4">
				{sortedIds &&
					sortedIds.map((id) => <AlbumTile key={id} albumId={id} />)}
			</div>
			{hasMore && (
				<div ref={ref} className="loader">
					Loading...
				</div>
			)}
		</div>
	)
}
export default Albums
