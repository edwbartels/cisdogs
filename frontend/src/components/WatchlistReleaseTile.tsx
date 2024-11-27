import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useWatchlistStore, { WatchlistRelease } from '../stores/watchlistStore'
import DropdownMenu from './DropdownMenu'
import EyeIcon from './EyeIcon'

interface WatchlistReleaseTileProps {
	itemId: number
}

type DropdownOptions = 'remove' | 'extra' | null

const WatchlistReleaseTile: React.FC<WatchlistReleaseTileProps> = ({
	itemId,
}) => {
	const release: WatchlistRelease = useWatchlistStore(
		(state) => state.releaseDetails[itemId]
	)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<{
		itemId: number
		type: DropdownOptions
	} | null>(null)

	// const menuOptions = [{ label: 'Remove', value: 'remove' }]
	const extraOptions = [
		// { label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	// const toggleDropdown = (drop: DropdownOptions) => setActiveDropdown(drop)

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			// case 'remove':
			// 	removeItem(itemId)
			// 	break
			// case 'item':
			// 	navigate(`/item/${release.item.id}`)
			// 	break
			case 'release':
				navigate(`/release/${release.id}`)
				break
			case 'album':
				navigate(`/album/${release.album.id}`)
				break
			case 'artist':
				navigate(`/artist/${release.artist.id}`)
				break
			default:
		}
		setActiveDropdown(null)
	}
	const handleOpenDropdown = (itemId: number, type: DropdownOptions) => {
		setActiveDropdown({ itemId, type })
	}

	const handleCloseDropdown = () => {
		setActiveDropdown(null)
	}

	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const clickInside = event.target.closest('.dropdown')
			if (!clickInside) {
				setActiveDropdown(null)
			}
		},
		[activeDropdown]
	)

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClickOutside])
	if (!release) {
		return <div>Release not found</div>
	}
	return (
		<>
			<div
				className={`flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8  ring-wax-gray`}
			>
				{' '}
				{`Release ID: ${release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<EyeIcon id={release.id} />

						{/* {!release.listing && (
							<div className="flex flex-col remove-dropdown">
								<FontAwesomeIcon
									icon={faMinus}
									size="xl"
									onClick={() =>
										activeDropdown?.itemId === itemId &&
										activeDropdown.type === 'remove'
											? handleCloseDropdown()
											: handleOpenDropdown(itemId, 'remove')
									}
									className="cursor-pointer hover:text-wax-cream"
								/>
								<DropdownMenu
									options={menuOptions}
									isOpen={
										activeDropdown?.itemId === itemId &&
										activeDropdown.type === 'remove'
									}
									onSelect={handleOptionSelect}
									className="border-wax-red font-semibold hover:ring-2 hover:ring-wax-gray hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray "
								/>
							</div>
						)} */}
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							onClick={() =>
								activeDropdown?.itemId === itemId &&
								activeDropdown.type === 'extra'
									? handleCloseDropdown()
									: handleOpenDropdown(itemId, 'extra')
							}
							className="cursor-pointer hover:text-wax-cream"
						/>
						<DropdownMenu
							title="View Details"
							options={extraOptions}
							isOpen={
								activeDropdown?.itemId === itemId &&
								activeDropdown.type === 'extra'
							}
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
					<div className="w-full font-semibold text-center cursor-default bg-opacity-60 text-wax-black bg-wax-silver">
						{release.album.title}
					</div>
					<div></div>
				</div>
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					<div className="cursor-pointer">{release.artist.name}</div>
				</div>
			</div>
		</>
	)
}

export default WatchlistReleaseTile
