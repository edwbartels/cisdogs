import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useArtistStore, { Artist } from '../stores/artistStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from './DropdownMenu'

interface ArtistTileProps {
	artistId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const ArtistTile: React.FC<ArtistTileProps> = ({ artistId }) => {
	const artist: Artist = useArtistStore((state) => state.artists[artistId])
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
	const extraOptions = [{ label: 'Artist', value: 'artist' }]

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			case 'artist':
				navigate(`/artist/${artist.id}`)
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

	if (!artist) {
		return <div>Artist not found</div>
	}
	return (
		<>
			<div className="tile-container ring-wax-gray">
				<div className="tile-title-bar">
					<div
						className="font-bold text-lg truncate cursor-pointer hover:text-wax-cream"
						onClick={() => navigate(`/artist/${artist.id}`)}
					>
						{artist.name}
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
						backgroundImage: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/artist/${artist.id}`)}
				>
					<div></div>
				</div>
				<div className="tile-footer-1"></div>
			</div>
		</>
	)
}

export default ArtistTile
