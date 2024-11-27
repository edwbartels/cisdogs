import React, { useState } from 'react'
import { Item } from '../stores/itemStore'
import useAuthStore from '../stores/authStore'
import ListingModal from './ListingModal'

interface ItemDetailsFormProps {
	item: Item | null
}

const ItemDetailsForm: React.FC<ItemDetailsFormProps> = ({ item }) => {
	const isOwner = item?.owner.id === useAuthStore((state) => state.user?.id)
	const [activeModal, setActiveModal] = useState<'listing' | null>(null)
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="p-10 text-center border w-96 border-wax-black aspect-video">
					Image Upload tbd...
				</div>
			</div>
			<div className="flex w-full">
				<div className="flex w-full p-4 bg-wax-gray bg-opacity-30">
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold">Artist</div>
								<div className="pl-2">{item?.artist.name}</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album</div>
								<div className="pl-2">{item?.album.title}</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release Variant</div>
								<div className="pl-2">{item?.release.variant}</div>
							</div>
							<div className="flex flex-col w-4/5">
								<div className="mt-1 ml-2 font-semibold">Format</div>
								<div className="pl-2">{item?.release.media_type}</div>
							</div>
						</div>
						{isOwner && (
							<button
								className="w-24 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
								onClick={() => {
									setActiveModal('listing')
								}}
							>
								Post Listing
							</button>
						)}
					</div>
					<div className="flex flex-col items-center justify-between w-1/2">
						<div className="font-semibold">Track List</div>
						<div className="pt-1 text-sm text-left">
							{item &&
								Object.values(item.album.track_data).map((track, index) => (
									<div key={index}>
										{index + 1}: {track}
									</div>
								))}
						</div>

						<div
							// onClick={getTracks}
							className="w-3/5 mt-4 text-center rounded-md cursor-pointer ring-2 ring-wax-silver text-wax-gray bg-wax-cream hover:ring-4"
						>
							Update Track Data
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

export default ItemDetailsForm
