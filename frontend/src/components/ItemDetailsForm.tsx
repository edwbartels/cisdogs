import React, { useState } from 'react'
import { Item } from '../stores/itemStore'
import useAuthStore from '../stores/authStore'
import ListingModal from './ListingModal'
import useModalStore from '../stores/modalStore'
import { useNavigate } from 'react-router-dom'

interface ItemDetailsFormProps {
	item: Item | null
}

const ItemDetailsForm: React.FC<ItemDetailsFormProps> = ({ item }) => {
	const navigate = useNavigate()
	const isOwner = item?.owner.id === useAuthStore((state) => state.user?.id)
	const { activeModal, setActiveModal } = useModalStore((state) => state)
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="flex p-4 min-w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img src={item?.album.art || '/tile-background.png'} />
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
						{isOwner && item?.listing ? (
							<button
								className="w-24 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
								onClick={() => navigate(`/listing/${item?.listing?.id}`)}
							>
								View Listing
							</button>
						) : (
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
					<div className="flex flex-col items-center  w-1/2">
						<div className="font-semibold">Track List</div>
						<div className="pt-1 text-sm text-left">
							{item &&
								Object.values(item.album.track_data).map((track, index) => (
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

export default ItemDetailsForm
