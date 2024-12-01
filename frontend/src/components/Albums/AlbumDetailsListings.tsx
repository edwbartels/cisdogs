import { useEffect } from 'react'
import useAlbumStore from '../../stores/albumStore'
import useListingStore from '../../stores/listingStore'
import ListingTile from '../Listings/ListingTileMain'

const AlbumDetailsListings = () => {
	const albumId = useAlbumStore((state) => state.focus?.id)
	const { listings, getByListings } = useListingStore((state) => state)

	useEffect(() => {
		getByListings('album', Number(albumId))
	}, [albumId])

	if (!Object.keys(listings).length)
		return <div className="m-4">No listings found.</div>
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(listings).map((id) => (
					<ListingTile key={id} listingId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default AlbumDetailsListings
