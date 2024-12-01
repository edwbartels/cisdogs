import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useArtistStore from '../../stores/artistStore'
import ArtistDetailsForm from './ArtistDetailsForm'
import ArtistDetailsContainer from './ArtistDetailsContainer'

const ArtistDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const artistId = id ? parseInt(id, 10) : null
	if (artistId === null || isNaN(artistId)) {
		return <p>Invalid Artist Id</p>
	}
	const getFocus = useArtistStore((state) => state.getFocus)
	const artist = useArtistStore((state) => state.focus)

	useEffect(() => {
		getFocus(artistId)
	}, [getFocus])

	if (!artist) return <div>Loading...</div>

	return (
		<>
			<ArtistDetailsForm artist={artist} />
			<ArtistDetailsContainer />
		</>
	)
}

export default ArtistDetails
