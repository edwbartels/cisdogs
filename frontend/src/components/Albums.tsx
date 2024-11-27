import { useEffect } from 'react'
import AlbumTile from './AlbumTile'
import useAlbumStore from '../stores/albumStore'
import useAuthStore from '../stores/authStore'

const Albums: React.FC = () => {
	const userId = useAuthStore((state) => state.user?.id)
	const { albums, getAlbums } = useAlbumStore((state) => state)

	useEffect(() => {
		getAlbums()
	}, [getAlbums])
	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Albums</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(albums).map((id) => (
					<AlbumTile key={id} albumId={Number(id)} />
				))}
			</div>
		</div>
	)
}
export default Albums
