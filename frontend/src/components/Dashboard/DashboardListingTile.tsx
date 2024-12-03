import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../../stores/userStore'
import { Listing } from '../../stores/listingStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'
import useDashboardStore from '../../stores/dashboardStore'

interface DashboardListingTitleProps {
	listingId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const DashboardListingTile: React.FC<DashboardListingTitleProps> = ({
	listingId,
}) => {
	const listing: Listing = useDashboardStore(
		(state) => state.listings.listings[listingId]
	)
	const deleteListing = useDashboardStore(
		(state) => state.listings.deleteListing
	)
	const navigate = useNavigate()
	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const menuOptions = [{ label: 'Cancel Listing', value: 'remove' }]
	const extraOptions = [
		{ label: 'Listing', value: 'listing' },
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'remove':
				deleteListing(listingId)
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

			if (!clickedRemove && activeDropdown === 'remove') setActiveDropdown(null)
			if (!clickedExtra && activeDropdown === 'extra') setActiveDropdown(null)
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
		console.log(listingId)
		return <div>Listing not found</div>
	}
	return (
		<>
			<div className="tile-container ring-wax-gray">
				{/* {`Release ID: ${listing.release.id}`} */}
				<div className="tile-title-bar">
					<div className="relative flex space-x-1">
						<EyeIcon id={listing.release.id} />
						<div className="flex flex-col remove-dropdown">
							<FontAwesomeIcon
								icon={faMinus}
								size="xl"
								onClick={() => setActiveDropdown('remove')}
								className="cursor-pointer hover:text-wax-cream"
							/>
							<DropdownMenu
								className="absolute left-0 w-24 font-bold text-center border border-4 rounded-lg shadow-lg cursor-pointer bg-wax-cream bottom-full border-wax-red hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray"
								options={menuOptions}
								isOpen={activeDropdown == 'remove'}
								onSelect={handleOptionSelect}
							/>
						</div>
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							className="cursor-pointer hover:text-wax-cream"
							onClick={() => setActiveDropdown('extra')}
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
							: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/listing/${listing.id}`)}
				>
					<div className="tile-art-title-bar">{listing.album.title}</div>
					{/* <div></div> */}
				</div>
				<div className="tile-footer-2">
					<div
						className="cursor-pointer self-center hover:text-wax-cream"
						onClick={() => navigate(`/artist/${listing.artist.id}`)}
					>
						{listing.artist.name}
					</div>
					<div className="flex justify-between items-end">
						<div
							className="cursor-pointer self-center truncate hover:text-wax-cream"
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
							${listing.price.toFixed(2)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default DashboardListingTile
