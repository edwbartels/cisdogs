import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Listing } from '../stores/listingStore'
import useAuthStore from '../stores/authStore'
import ListingModal from './ListingModal'
import fetchWithAuth from '../utils/fetch'
import { capitalizeFirst } from '../utils/capitalize'

interface ListingDetailsFormProps {
	listing: Listing
}

const ListingDetailsForm: React.FC<ListingDetailsFormProps> = ({ listing }) => {
	const navigate = useNavigate()
	const isOwner = listing.seller.id === useAuthStore((state) => state.user?.id)
	const { cart, addToCart, removeFromCart } = useAuthStore((state) => state)
	const [activeModal, setActiveModal] = useState<'listing' | null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [editDetails, setEditDetails] = useState({
		price: listing.price,
		quality: listing.quality,
		description: listing.description,
	})
	const [tempValuePrice, setTempValuePrice] = useState<Listing['price']>(
		editDetails.price
	)
	const [tempValueQuality, setTempValueQuality] = useState<Listing['quality']>(
		editDetails.quality
	)
	const [tempValueDesc, setTempValueDesc] = useState<Listing['description']>(
		editDetails.description
	)

	const handleSubmit = async () => {
		const newDetails = {
			...listing,
			price: tempValuePrice,
			quality: tempValueQuality,
			description: tempValueDesc,
		}
		try {
			const url = `/api/listings/${listing.id}`
			const res = await fetchWithAuth(url, {
				method: 'PUT',
				body: JSON.stringify(newDetails),
				credentials: 'include',
			})
			if (!res.ok) {
				const error = await res.text()
				console.log(error)
				throw new Error('Failed to update listing')
			}
			const newListing = await res.json()
			listing.price = newListing.price
			listing.quality = newListing.quality
			listing.description = newListing.description
			setEditDetails({
				price: tempValuePrice,
				quality: tempValueQuality,
				description: tempValueDesc,
			})
			setIsEditing(false)
		} catch (e) {
			console.error(e)
		}
	}
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="flex p-4 min-w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img src={listing.album.art || '/tile-background.png'} />
				</div>
			</div>
			<div className="flex w-full justify-evenly">
				<div className="flex w-full p-4 bg-wax-gray bg-opacity-30">
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold underline">Artist</div>
								<div
									className="pl-2 max-w-fit cursor-pointer hover:underline"
									onClick={() => navigate(`/artist/${listing.artist.id}`)}
								>
									{capitalizeFirst(listing.artist.name)}
								</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album</div>
								<div
									className="pl-2 max-w-fit cursor-pointer hover:underline"
									onClick={() => navigate(`/album/${listing.album.id}`)}
								>
									{capitalizeFirst(listing.album.title)}
								</div>
							</div>
							<div className="flex flex-col w-4/5">
								<div className="mt-1 ml-2 font-semibold">Format</div>
								<div className="pl-2">
									{capitalizeFirst(listing.release.media_type)}
								</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release / Variant</div>
								<div
									className="max-w-fit pl-2 cursor-pointer hover:underline"
									onClick={() => navigate(`/release/${listing.release.id}`)}
								>
									{capitalizeFirst(listing.release.variant)}
								</div>
							</div>
						</div>
					</div>
					<div className="px-4 flex flex-col justify-between">
						<div className="flex flex-col ">
							<div className="flex flex-col ">
								<div className="ml-2 font-semibold">Price</div>
								{isEditing ? (
									<input
										type="number"
										defaultValue={listing.price}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setTempValuePrice(Number(e.target.value))
										}
									/>
								) : (
									<div className="pl-2">{listing.price}</div>
								)}
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold">Quality</div>
								{isEditing ? (
									<select
										defaultValue={listing.quality}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
											setTempValueQuality(
												e.target.value as 'm' | 'vg' | 'g' | 'f' | 'ng'
											)
										}
									>
										<option value="" disabled>
											Select Quality
										</option>
										<option value="m">Mint</option>
										<option value="vg">Very Good</option>
										<option value="g">Good</option>
										<option value="f">Fair</option>
										<option value="ng">Not Good</option>
									</select>
								) : (
									<div className="pl-2">{listing.quality.toUpperCase()}</div>
								)}
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold">Description</div>
								{isEditing ? (
									<textarea
										defaultValue={tempValueDesc || ''}
										onChange={(e) => setTempValueDesc(e.target.value)}
									/>
								) : (
									<div className="pl-2">{listing.description}</div>
								)}
							</div>
						</div>
						<div className="flex">
							{isOwner ? (
								isEditing ? (
									<>
										<button
											className="w-28 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
											onClick={handleSubmit}
										>
											Save Changes
										</button>
										<button
											className="w-28 mt-4 ml-8 bg-wax-red rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
											onClick={() => {
												setIsEditing(false)
											}}
										>
											Cancel
										</button>
									</>
								) : (
									<button
										className="w-24 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
										onClick={() => {
											setIsEditing(true)
										}}
									>
										Edit Listing
									</button>
								)
							) : Object.keys(cart).includes(listing.id.toString()) ? (
								<button
									className="w-40 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
									onClick={() => {
										removeFromCart({
											id: listing.id,
											seller_id: listing.seller.id,
											price: listing.price,
											release_id: listing.release.id,
											release: listing.release.variant || '',
											album: listing.album.title,
											artist: listing.artist.name,
										})
									}}
								>
									Remove from Cart
								</button>
							) : (
								<button
									className="w-24 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
									onClick={() => {
										addToCart({
											id: listing.id,
											seller_id: listing.seller.id,
											price: listing.price,
											release_id: listing.release.id,
											release: listing.release.variant || '',
											album: listing.album.title,
											artist: listing.artist.name,
										})
									}}
								>
									Add to Cart
								</button>
							)}
						</div>
					</div>
					<div className="flex flex-col items-center  w-1/2">
						<div className="font-semibold">Track List</div>
						<div className="pt-1 text-sm text-left">
							{Object.values(listing.album.track_data).map((track, index) => (
								<div key={index}>
									{index + 1}: {track}
								</div>
							))}
						</div>
					</div>
					<ListingModal
						isOpen={activeModal === 'listing'}
						onClose={() => setActiveModal(null)}
						data={null}
					/>
				</div>
			</div>
		</div>
	)
}

export default ListingDetailsForm
