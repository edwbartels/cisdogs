import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useItemStore from '../../stores/itemStore'
import useAuthStore from '../../stores/authStore'
import fetchWithAuth from '../../utils/fetch'
import { capitalizeFirst } from '../../utils/capitalize'

export type Item = {
	id: number
	release: string
	album: string
	artist: string
}
type Artist = {
	id: number
	name: string
	albums: Album[]
}
type Album = {
	id: number
	title: string
	releases: Release[]
}
type Release = {
	id: number
	variant: string | null
	media_type: string
	items: {
		id: number
	}[]
}
interface ListingModalProps {
	isOpen: boolean
	onClose: () => void
	data: {
		artists: Artist[]
	} | null
}

const ListingModal: React.FC<ListingModalProps> = ({
	isOpen,
	onClose,
	data,
}) => {
	const navigate = useNavigate()
	const [errors, setErrors] = useState({
		item_id: '',
		seller_id: '',
		price: '',
		quality: '',
		description: '',
	})
	const userId = useAuthStore((state) => state.user?.id)
	const item = useItemStore((state) => state.focus) || null
	// if
	const [listingDetails, setListingDetails] = useState({
		item_id: item?.id || null,
		seller_id: item?.owner.id || null,
		price: 0,
		quality: '',
		description: '',
	})
	const [selectedArtist, setSelectedArtist] = useState<number | null>(
		item?.artist.id || null
	)
	const [selectedAlbum, setSelectedAlbum] = useState<number | null>(
		item?.album.id || null
	)
	const [selectedRelease, setSelectedRelease] = useState<number | null>(
		item?.release.id || null
	)
	const sortedArtists = useMemo(() => {
		if (!data) return []
		return [...data.artists].sort((a, b) => a.name.localeCompare(b.name))
	}, [data])
	useEffect(() => {
		setListingDetails({
			...listingDetails,
			item_id: item?.id || null,
			seller_id: userId || null,
		})
	}, [item, userId])
	const clearInfo = () => {
		setSelectedArtist(null)
		setSelectedAlbum(null)
		setSelectedRelease(null)
		setListingDetails({
			...listingDetails,
			price: 0,
			quality: '',
			description: '',
		})
		// useItemStore.setState({ focus: null })
	}

	const filteredAlbums = useMemo(() => {
		if (!selectedArtist) return []
		const artist = data?.artists.find((a) => a.id === selectedArtist)
		return artist
			? [...artist.albums].sort((a, b) => a.title.localeCompare(b.title))
			: []
	}, [selectedArtist, data])

	const filteredReleases = useMemo(() => {
		if (!selectedAlbum) return []
		const album = filteredAlbums.find((a) => a.id === selectedAlbum)
		return album
			? [...album.releases].sort((a, b) =>
					(a.variant || '').localeCompare(b.variant || '')
			  )
			: []
	}, [selectedAlbum, filteredAlbums])

	const handleArtistChange = (artistId: number) => {
		setSelectedArtist(artistId)
		setSelectedAlbum(null)
		setSelectedRelease(null)
	}

	const handleAlbumChange = (albumId: number) => {
		setSelectedAlbum(albumId)
		setSelectedRelease(null)
	}

	const handleReleaseChange = (releaseId: number) => {
		setSelectedRelease(releaseId)

		const artist = data?.artists.find((artist) =>
			artist.albums.some((album) =>
				album.releases.some((release) => release.id === releaseId)
			)
		)
		const album = artist?.albums.find((album) =>
			album.releases.some((release) => release.id === releaseId)
		)
		const release = album?.releases.find((release) => release.id === releaseId)
		const item = release?.items[0]
		const itemId = item && item.id

		setSelectedArtist(artist?.id || null)
		setSelectedAlbum(album?.id || null)
		setListingDetails({
			...listingDetails,
			item_id: itemId || null,
			seller_id: userId || null,
		})
	}

	// }
	const handleFormChange =
		(listingDetailsField: string) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			if (listingDetailsField === 'price') {
				if (parseFloat(e.target.value) <= 0) {
					setErrors({
						...errors,
						price: 'Price must be a positive number',
					})
				} else {
					setErrors({
						...errors,
						price: '',
					})
				}
			}
			setListingDetails({
				...listingDetails,
				[listingDetailsField]: e.target.value,
			})
		}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const requiredFields = []
		if (!selectedArtist) requiredFields.push('Artist')
		if (!selectedAlbum) requiredFields.push('Album')
		if (!selectedRelease) requiredFields.push('Release')
		if (requiredFields.length > 0) {
			alert(
				`The following fields are required:\n` +
					`${requiredFields.map((field) => ` - ${field}`).join('\n')}`
			)
			return
		}
		if (errors.price === '') {
			item && setListingDetails({ ...listingDetails, item_id: item.id })
			userId && setListingDetails({ ...listingDetails, seller_id: userId })
			try {
				const url = '/api/listings/'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					body: JSON.stringify(listingDetails),
					credentials: 'include',
				})
				if (!res.ok) {
					const error = await res.text()
					console.log(error)
					throw new Error('Failed to create listing')
				}
				const data = await res.json()
				const { id } = data
				clearInfo()
				onClose()
				navigate(`/listing/${id}`)
			} catch (e) {
				console.error(e)
			}
		}
	}
	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center text-center bg-opacity-50 bg-wax-black"
			onClick={onClose}
		>
			<div
				className="flex flex-col w-1/2 p-4 border-4 rounded shadow-lg bg-wax-silver border-wax-gray space-y-1 dark:bg-waxDark-silver dark:border-waxDark-gray"
				onClick={(e) => e.stopPropagation()}
			>
				<strong className="text-wax-black border-b-2 border-wax-black pb-1 mb-4">
					Create Listing
				</strong>
				{item ? (
					<>
						<div className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
							{`${item?.artist.name} - ${item?.album.title}`}
						</div>
						<div className="mb-4 text-2xl font-bold text-wax-black">
							{`${item?.release.variant} - ${item?.release.media_type}`}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center space-y-2 text-wax-gray">
						<div className="w-3/5">
							{/* <label>Artist</label> */}
							<select
								value={selectedArtist || ''}
								onChange={(e) => handleArtistChange(Number(e.target.value))}
								className="block w-full p-2  border rounded text-wax-black"
							>
								<option value="">Select Artist</option>
								{sortedArtists.map((artist) => (
									<option key={artist.id} value={artist.id}>
										{artist.name}
									</option>
								))}
							</select>
						</div>
						<div className="w-3/5">
							{/* <label>Album</label> */}
							<select
								value={selectedAlbum || ''}
								onChange={(e) => handleAlbumChange(Number(e.target.value))}
								className="block w-full p-2 border rounded text-wax-black"
								disabled={!selectedArtist}
							>
								<option value="">Select Album</option>
								{filteredAlbums.map((album) => (
									<option key={album.id} value={album.id}>
										{album.title}
									</option>
								))}
							</select>
						</div>
						<div className="w-3/5">
							{/* <label>Release</label> */}
							<select
								value={selectedRelease || ''}
								onChange={(e) => handleReleaseChange(Number(e.target.value))}
								className="block w-full p-2 border rounded text-wax-black"
								disabled={!selectedAlbum}
								required
							>
								<option value="">Select Release</option>
								{filteredReleases.map((release) => (
									<option key={release.id} value={release.id}>
										{capitalizeFirst(release.variant)}
									</option>
								))}
							</select>
						</div>
					</div>
				)}
				<form
					className="flex flex-col self-center w-3/5 pt-1"
					onSubmit={handleSubmit}
				>
					<select
						onChange={handleFormChange('quality')}
						defaultValue={listingDetails.quality}
						className="block w-full p-2 mb-2 border rounded text-wax-black"
						required
					>
						<option value="" disabled>
							Select Quality
						</option>
						<option value="m">Mint</option>
						<option value="vg">Very Good</option>
						<option value="g">Good</option>
						<option value="f">Fair</option>
						<option value="ng">Not Good</option>
					</select>
					<textarea
						onChange={handleFormChange('description')}
						defaultValue={listingDetails.description}
						placeholder="Description"
						className="block w-full p-1 mb-2 border rounded text-wax-black max-h-60"
						rows={5}
						required
					/>
					<div className="relative w-full mb-2">
						<span className="absolute inset-y-0 left-0 self-center pl-2 text-wax-silver">
							$
						</span>
						<input
							type="number"
							onChange={handleFormChange('price')}
							// defaultValue={listingDetails.price}
							value={listingDetails.price}
							// placeholder=
							className="block w-full  pl-6 p-1 border rounded text-wax-black"
							min="0.01"
							step="0.01"
						/>
					</div>
					{errors.price && (
						<div className="text-wax-red text-sm">
							Price must be a postive number
						</div>
					)}
					<button
						type="submit"
						className="w-4/5 self-center py-2 mt-2 bg-wax-green border-4 rounded border-wax-silver text-wax-cream hover:border-wax-green dark:bg-waxDark-green dark:hover:border-waxDark-green"
					>
						Post
					</button>
					<button
						onClick={onClose}
						className="w-3/5 self-center px-4 py-2 mt-2 text-white border-4 rounded border-wax-silver bg-wax-red hover:border-wax-red dark:bg-waxDark-red dark:hover:border-waxDark-red"
					>
						Close
					</button>
				</form>
			</div>
		</div>
	)
}
export default ListingModal
