import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useListingStore from '../../stores/listingStore'
import ListingDetailsForm from './ListingDetailsForm'

const ListingDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const listingId = id ? parseInt(id, 10) : null
	if (listingId === null || isNaN(listingId)) {
		return <p>Invalid Listing Id</p>
	}
	const getFocus = useListingStore((state) => state.getFocus)
	const listing = useListingStore((state) => state.focus)

	useEffect(() => {
		getFocus(listingId)
	}, [getFocus])

	if (!listing) return <div>Loading...</div>

	return <ListingDetailsForm listing={listing} />
}

export default ListingDetails
