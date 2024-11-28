import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAlbumStore from '../stores/albumStore'
import AlbumDetailsForm from './AlbumDetailsForm'
import AlbumDetailsContainer from './AlbumDetailsContainer'

const AlbumDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const albumId = id ? parseInt(id, 10) : null
	if (albumId === null || isNaN(albumId)) {
		return <p>Invalid Album Id</p>
	}
	const getFocus = useAlbumStore((state) => state.getFocus)
	const album = useAlbumStore((state) => state.focus)
	// const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		getFocus(albumId)
	}, [getFocus])

	if (!album) return <div>Loading...</div>

	return (
		<>
			<AlbumDetailsForm album={album} />
			<AlbumDetailsContainer />
		</>
	)
}

export default AlbumDetails
