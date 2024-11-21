import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faEllipsis } from '@fortawesome/free-solid-svg-icons'

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
			<div className="flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ring-wax-gray ">
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="space-x-1">
						<FontAwesomeIcon
							icon={faEye}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
						/>
						<FontAwesomeIcon
							icon={faPlus}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
						/>
					</div>
					<FontAwesomeIcon
						icon={faEllipsis}
						size="xl"
						className="cursor-pointer hover:text-wax-cream"
					/>
				</div>
				<div
					className="flex flex-col justify-between w-full h-56 text-wax-gray "
					style={{
						backgroundImage: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
				>
					{/* {listing.album.art && <img src=`${listing.album.art}` className='object-contain w-full aspect-square'} */}

					<div className="w-full font-semibold text-center bg-opacity-60 text-wax-black bg-wax-silver">
						{listing.album.title}
					</div>
					<div></div>
				</div>
				{/* <div className="w-full h-8 bg-wax-gray text-wax-amber"> */}
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					<div className="cursor-pointer">{`$${listing.price}`}</div>
					<div className="cursor-pointer">{listing.seller.username}</div>
					{/* </div> */}
				</div>
			</div>
		</>
	)
}

export default ListingTileMain
