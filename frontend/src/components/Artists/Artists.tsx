import { useEffect } from 'react'
import useArtistStore from '../../stores/artistStore'
import ArtistTile from './ArtistTile'

const Artists: React.FC = () => {
	const { artists, getArtists } = useArtistStore((state) => state)
	const sortedIds = useArtistStore((state) => state.pagination?.sorted_ids)

	useEffect(() => {
		getArtists()
	}, [getArtists])
	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Artists</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => <ArtistTile key={id} artistId={id} />)}
			</div>
		</div>
	)
}
export default Artists
