import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useWatchlistStore, {
	WatchlistRelease,
} from '../../stores/watchlistStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'

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

	const extraOptions = [
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
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
		<div className="tile-container ring-wax-gray">
			<div className="tile-title-bar">
				<div className="relative flex space-x-1">
					<EyeIcon id={release.id} />
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
				className="tile-art-container"
				style={{
					backgroundImage: release.album.art
						? `url(${release.album.art})`
						: "url('/tile-background.png')",
					backgroundSize: 'contain',
					backgroundPosition: 'center',
				}}
				onClick={() => navigate(`/release/${release.id}`)}
			>
				<div className="tile-art-title-bar">{release.album.title}</div>
				<div></div>
			</div>

			<div className="tile-footer-2">
				<div
					className="cursor-pointer self-center hover:text-wax-cream"
					onClick={() => navigate(`/artist/${release.artist.id}`)}
				>
					{release.artist.name}
				</div>
				<div
					className="truncate self-center cursor-pointer hover:text-wax-cream"
					onClick={() => navigate(`/release/${release.id}`)}
				>
					{`${release.media_type.toUpperCase()}`}{' '}
					{release.media_type == 'vinyl' &&
						` | ${capitalizeFirst(release.variant)}`}
				</div>
			</div>
		</div>
	)
}

export default WatchlistReleaseTile
