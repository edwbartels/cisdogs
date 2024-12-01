import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from '../Util/DropdownMenu'
import useListingStore, { Listing } from '../../stores/listingStore'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'

interface ListingTileMainProps {
	listingId: number
}

type DropdownOptions = 'remove' | 'extra' | 'add' | null

const ListingTileMain: React.FC<ListingTileMainProps> = ({ listingId }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const listing: Listing = useListingStore((state) => state.listings[listingId])
	const { cart, addToCart } = useAuthStore((state) => state)

	const { collection, addToCollection } = useUserStore((state) => state)
	const userListings: number[] = useUserStore((state) => state.listingIds)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const addOptions = []
	if (!cart[listing?.id]) addOptions.push({ label: 'To Cart', value: 'cart' })
	// const addOptions = [{ label: 'To Cart', value: 'cart' }]
	if (isLoggedIn && !collection?.has(listing?.release?.id))
		addOptions.push({ label: 'To Collection', value: 'collection' })

	const extraOptions = [
		{ label: 'Listing', value: 'listing' },
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
					seller_id: listing.seller.id,
					price: listing.price,
					release_id: listing.release.id,
					release: listing.release.variant || '',
					album: listing.album.title,
					artist: listing.artist.name,
				})
				break
			case 'listing':
				navigate(`/listing/${listing.id}`)
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
				className={`tile-container ${
					userListings.includes(listing.id) ? 'ring-green-700' : 'ring-wax-gray'
				}`}
			>
				<div className="tile-title-bar">
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
					className="tile-art-container"
					style={{
						backgroundImage: listing.album.art
							? `url(${listing.album.art})`
							: `url('/tile-background.png')`,
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/listing/${listing.id}`)}
				>
					<div className="tile-art-title-bar">{listing.album.title}</div>
					<div></div>
				</div>
				<div className="tile-footer-2">
					<div
						className="cursor-pointer  hover:text-wax-cream"
						onClick={() => navigate(`/artist/${listing.artist.id}`)}
					>
						{listing.artist.name}
					</div>
					<div className="flex justify-between cursor-pointer ">
						<div
							className="truncate hover:text-wax-cream"
							onClick={() => navigate(`/release/${listing.release.id}`)}
						>
							{`${listing.release.media_type.toUpperCase()}`}{' '}
							{listing.release.media_type == 'vinyl' &&
								` | ${capitalizeFirst(listing.release.variant)}`}
						</div>
						<div
							className="cursor-pointer hover:text-wax-cream"
							onClick={() => navigate(`/listing/${listing.id}`)}
						>
							${listing.price}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ListingTileMain
