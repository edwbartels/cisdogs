import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAlbumStore, { Album } from '../../stores/albumStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from '../Util/DropdownMenu'

interface AlbumTileProps {
	albumId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const AlbumTile: React.FC<AlbumTileProps> = ({ albumId }) => {
	const album: Album = useAlbumStore((state) => state.albums[albumId])
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const extraOptions = [
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'album':
				navigate(`/album/${album.id}`)
				break
			case 'artist':
				navigate(`/artist/${album.artist.id}`)
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

	if (!album) {
		return <div>Album not found</div>
	}
	return (
		<>
			<div className="tile-container ring-wax-gray dark:ring-waxDark-black">
				<div className="tile-title-bar">
					<div
						className="font-bold text-lg truncate cursor-pointer hover:text-wax-cream dark:hover:text-waxDark-silver"
						onClick={() => navigate(`/artist/${album.artist.id}`)}
					>
						{album.artist?.name}
					</div>

					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							className="cursor-pointer hover:text-wax-cream dark:hover:text-waxDark-silver"
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
						backgroundImage: album.art
							? `url(${album.art})`
							: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/album/${album.id}`)}
				></div>
				{/* <div className="w-full h-8 bg-wax-gray text-wax-amber"> */}
				<div className="tile-footer-1">
					{/* <div className="cursor-pointer">{`$${listing.price}`}</div> */}
					<div
						className="cursor-pointer self-center w-full truncate hover:text-wax-cream dark:hover:text-waxDark-silver"
						onClick={() => navigate(`/album/${album.id}`)}
					>
						{album?.title}
					</div>
					{/* </div> */}
				</div>
			</div>
		</>
	)
}

export default AlbumTile
