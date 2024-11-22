import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useListingStore from '../stores/listingStore'
import useAuthStore from '../stores/authStore'

const ListingDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const listingId = id ? parseInt(id, 10) : null
	if (listingId === null || isNaN(listingId)) {
		return <p>Invalid Listing Id</p>
	}
	const getFocus = useListingStore((state) => state.getFocus)
	const listing = useListingStore((state) => state.focus)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		getFocus(listingId)
	}, [getFocus])

	if (!listing) return <div>Loading...</div>

	return (
		<div>{`ID: ${listing.id} Price: $${listing.price} Album: ${listing.album.title}`}</div>
	)
}

export default ListingDetails
