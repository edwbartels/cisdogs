import React from 'react'
import useListingStore, { Listing } from '../stores/listingStore'

interface ListingTileMainProps {
	listingId: number
}

const ListingTileMain: React.FC<ListingTileMainProps> = ({ listingId }) => {
	const listing: Listing = useListingStore((state) => state.listings[listingId])

	if (!listing) {
		return <div>Listing not found</div>
	}
	return (
		<>
			<div className="flex flex-col items-center justify-center w-64 border-8 rounded h-80 bg-wax-cream border-wax-amber ">
				<div className="flex flex-col w-full h-64 text-wax-gray">
					<img
						src="/wax-exchange-black-amber.png"
						className="object-contain w-full aspect-square"
					/>
				</div>
				<div className="bottom">
					<div className="details">{`$${listing.price}`}</div>
					<div>{listing.seller.username}</div>
				</div>
			</div>
		</>
	)
}

export default ListingTileMain
