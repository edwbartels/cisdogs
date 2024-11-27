import { useEffect } from 'react'
import ArtistTile from './ArtistTile'
import useArtistStore from '../stores/artistStore'
import useAuthStore from '../stores/authStore'

const Artists: React.FC = () => {
	const userId = useAuthStore((state) => state.user?.id)
	const { artists, getArtists } = useArtistStore((state) => state)

	useEffect(() => {
		getArtists()
	}, [getArtists])
	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Artists</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(artists).map((id) => (
					<ArtistTile key={id} artistId={Number(id)} />
				))}
			</div>
		</div>
	)
}
export default Artists
