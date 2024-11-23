import React, { useState } from 'react'
import useItemStore from '../stores/itemStore'
import fetchWithAuth from '../utils/fetch'

interface ListingModalProps {
	isOpen: boolean
	onClose: () => void
}
const ListingModal: React.FC<ListingModalProps> = ({ isOpen, onClose }) => {
	const item = useItemStore((state) => state.focus)
	const [listingDetails, setListingDetails] = useState({
		item_id: item?.id,
		seller_id: item?.owner.id,
		price: 0,
		quality: '',
		description: '',
		status: 'available',
	})

	const handleFormChange =
		(listingDetailsField: string) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			setListingDetails({
				...listingDetails,
				[listingDetailsField]: e.target.value,
			})
		}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const token = localStorage.getItem('accessToken')
			const url = '/api/listings/'
			const res = await fetchWithAuth(url, {
				method: 'POST',
				body: JSON.stringify(listingDetails),
				credentials: 'include',
			})
			if (!res.ok) {
				const error = await res.text()
				console.log(error)
				throw new Error('Failed to create listing')
			}
			onClose()
		} catch (e) {
			console.error(e)
		}
	}
	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center text-center bg-opacity-50 bg-wax-black"
			onClick={onClose}
		>
			<div
				className="flex flex-col w-1/2 p-4 border-4 rounded shadow-lg bg-wax-silver border-wax-gray"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
					{`${item?.artist.name} - ${item?.album.title}`}
				</div>
				<div className="mb-4 text-2xl font-bold text-wax-black">
					{`${item?.release.variant} - ${item?.release.media_type}`}
				</div>
				<form className="flex flex-col items-center" onSubmit={handleSubmit}>
					<select
						onChange={handleFormChange('quality')}
						defaultValue={listingDetails.quality}
						className="block w-3/5 p-2 mb-2 border rounded text-wax-black"
						required
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
					<textarea
						onChange={handleFormChange('description')}
						defaultValue={listingDetails.description}
						placeholder="Description"
						className="block w-3/5 p-1 mb-2 border rounded text-wax-black max-h-60"
						rows={5}
						required
					/>
					<input
						type="number"
						onChange={handleFormChange('price')}
						defaultValue={listingDetails.price}
						className="block w-3/5 p-1 mb-2 border rounded text-wax-black"
					/>
					<button
						type="submit"
						className="w-2/5 py-2 mt-2 bg-green-700 border-4 rounded border-wax-silver text-wax-cream hover:border-green-700"
					>
						Post
					</button>
					<button
						onClick={onClose}
						className="w-1/5 px-4 py-2 mt-2 text-white border-4 rounded border-wax-silver bg-wax-red hover:border-wax-red"
					>
						Close
					</button>
				</form>
			</div>
		</div>
	)
}
export default ListingModal
