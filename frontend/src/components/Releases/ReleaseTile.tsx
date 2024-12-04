import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useReleaseStore, { Release } from '../../stores/releaseStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'
import { capitalizeFirst } from '../../utils/capitalize'

interface ReleaseTileProps {
	releaseId: number
}
type DropdownOptions = 'remove' | 'extra' | null

const ReleaseTile: React.FC<ReleaseTileProps> = ({ releaseId }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const release: Release = useReleaseStore((state) => state.releases[releaseId])
	const { collection, addToCollection } = useUserStore((state) => state)
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<DropdownOptions>(null)
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

	if (!release) {
		return <div>Release not found</div>
	}
	return (
		<>
			<div className="tile-container ring-wax-gray">
				<div className="tile-title-bar">
					<div className="space-x-1">
						<EyeIcon id={release.id} />
						{!collection.has(Number(release.id)) && (
							<FontAwesomeIcon
								icon={faPlus}
								size="xl"
								className="cursor-pointer hover:text-wax-cream"
								onClick={() =>
									userId &&
									addToCollection({
										release_id: release.id,
										owner_id: userId,
									})
								}
							/>
						)}
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
						backgroundImage: release.album.art
							? `url(${release.album.art})`
							: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
					onClick={() => navigate(`/release/${release.id}`)}
				>
					{/* {listing.album.art && <img src=`${listing.album.art}` className='object-contain w-full aspect-square'} */}

					<div className="tile-art-title-bar">{release.album?.title}</div>
					<div></div>
				</div>
				<div className="tile-footer-2">
					<div
						className="cursor-pointer w-fit self-center hover:text-wax-cream"
						onClick={() => navigate(`/artist/${release.artist.id}`)}
					>
						{release.artist?.name}
					</div>
					<div
						className="cursor-pointer self-center truncate hover:text-wax-cream"
						onClick={() => navigate(`/release/${release.id}`)}
					>
						{`${release.media_type.toUpperCase()}`}{' '}
						{release.media_type == 'vinyl' &&
							` | ${capitalizeFirst(release.variant)}`}
					</div>
				</div>
			</div>
		</>
	)
}

export default ReleaseTile
