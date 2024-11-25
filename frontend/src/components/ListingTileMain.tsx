import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from './DropdownMenu'
import useListingStore, { Listing } from '../stores/listingStore'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'
import EyeIcon from './EyeIcon'

interface ListingTileMainProps {
	listingId: number
}

type DropdownOptions = 'remove' | 'extra' | 'add' | null

const ListingTileMain: React.FC<ListingTileMainProps> = ({ listingId }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const listing: Listing = useListingStore((state) => state.listings[listingId])
	const addToCart = useAuthStore((state) => state.addToCart)

	const { collection, addToCollection } = useUserStore((state) => state)
	const userListings: number[] = useUserStore((state) => state.listingIds)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const addOptions = [{ label: 'To Cart', value: 'cart' }]
	if (!collection.has(listing.id))
		addOptions.push({ label: 'To Collection', value: 'collection' })

	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'collection':
				userId &&
					addToCollection({
						release_id: listing.release.id,
						owner_id: userId,
					})
				break
			case 'cart':
				addToCart({
					id: listing.id,
					price: listing.price,
					name: `${listing.release.variant || ''} ${listing.album.title} - ${
						listing.artist.name
					}`,
				})
				break
			case 'item':
				navigate(`/item/${listing.item.id}`)
				break
			case 'release':
				navigate(`/release/${listing.release.id}`)
				break
			case 'album':
				navigate(`/album/${listing.album.id}`)
				break
			case 'artist':
				navigate(`/artist/${listing.artist.id}`)
				break
			default:
		}
		setActiveDropdown(null)
	}

	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const targetElement = event.target as Element

			const clickedRemove = targetElement.closest('.remove-dropdown')
			const clickedExtra = targetElement.closest('.extra-dropdown')
			const clickedAdd = targetElement.closest('.add-dropdown')

			if (!clickedRemove && activeDropdown === 'remove') setActiveDropdown(null)
			if (!clickedExtra && activeDropdown === 'extra') setActiveDropdown(null)
			if (!clickedAdd && activeDropdown === 'add') setActiveDropdown(null)
		},
		[activeDropdown]
	)
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClickOutside])
	if (!listing) {
		return <div>Listing not found</div>
	}
	return (
		<>
			<div
				className={`flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 ${
					userListings.includes(listing.id) ? 'ring-green-700' : 'ring-wax-gray'
				}`}
			>
				{`Release ID: ${listing.release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="space-x-1 flex">
						<EyeIcon id={listing.release.id} />
						<div className="relative flex flex-col add-dropdown">
							<FontAwesomeIcon
								icon={faPlus}
								size="xl"
								className="cursor-pointer hover:text-wax-cream"
								onClick={() => setActiveDropdown('add')}
							/>
							<DropdownMenu
								options={addOptions}
								onSelect={handleOptionSelect}
								isOpen={activeDropdown === 'add'}
								className="bottom-full font-bold hover:ring-2"
							/>
						</div>
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							onClick={() => setActiveDropdown('extra')}
							className="cursor-pointer hover:text-wax-cream"
						/>
						<DropdownMenu
							title="View Details"
							options={extraOptions}
							isOpen={activeDropdown == 'extra'}
							onSelect={handleOptionSelect}
							className="-right-2 bg-wax-cream"
						/>
					</div>
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
